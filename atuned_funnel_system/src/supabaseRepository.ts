import type {
  AttachmentChallenge, FunnelEvent, FunnelSession, IdempotencyClaim,
  Referral, StarterGift, StarterGiftItem, TutorialProgress, UsageLedgerEntry, UsageSource,
} from './domain.js';
import { FunnelError } from './domain.js';
import type { FunnelRepository } from './adapters.js';

type Row = Record<string, any>;

export interface SupabaseFunnelRepositoryOptions {
  url: string;
  serviceRoleKey: string;
  fetchImpl?: typeof fetch;
}

export class SupabaseFunnelRepository implements FunnelRepository {
  private readonly url: string;
  private readonly key: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: SupabaseFunnelRepositoryOptions) {
    this.url = options.url.replace(/\/$/, '');
    this.key = options.serviceRoleKey;
    this.fetchImpl = options.fetchImpl ?? fetch;
    if (!this.url || !this.key) throw new Error('Supabase URL and service role key are required');
  }

  private headers(init?: HeadersInit): Headers {
    const h = new Headers(init);
    h.set('apikey', this.key);
    h.set('Authorization', `Bearer ${this.key}`);
    h.set('Content-Type', 'application/json');
    return h;
  }

  private async request(path: string, init: RequestInit = {}): Promise<any> {
    const response = await this.fetchImpl(`${this.url}/rest/v1/${path}`, {...init, headers:this.headers(init.headers)});
    if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  private async rpc(name: string, body: Row): Promise<any> {
    const response = await this.fetchImpl(`${this.url}/rest/v1/rpc/${name}`, {
      method:'POST', headers:this.headers(), body:JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Supabase RPC ${response.status}: ${await response.text()}`);
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  private one(rows: Row[] | null): Row | null { return rows?.[0] ?? null; }

  async getSession(id:string):Promise<FunnelSession|null>{
    const r=this.one(await this.request(`funnel_sessions?id=eq.${encodeURIComponent(id)}&select=*`)); if(!r)return null;
    return {id:r.id,anonymousId:r.anonymous_id,userId:r.user_id??null,state:r.state,status:r.status,
      selectedGroundId:r.selected_ground_id??null,starterGiftId:r.starter_gift_id??null,tutorialCompleted:r.tutorial_completed,
      firstReleaseId:r.first_release_id??null,verificationId:r.verification_id??null,version:r.version,createdAt:r.created_at,updatedAt:r.updated_at};
  }

  async saveSession(s:FunnelSession):Promise<void>{
    const existing=await this.getSession(s.id);
    if(existing && existing.version>=s.version) throw new FunnelError('STALE_VERSION',`session ${s.id} stale write`);
    await this.request('funnel_sessions',{method:'POST',
      headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify({id:s.id,anonymous_id:s.anonymousId,user_id:s.userId,state:s.state,status:s.status,
        selected_ground_id:s.selectedGroundId,starter_gift_id:s.starterGiftId,tutorial_completed:s.tutorialCompleted,
        first_release_id:s.firstReleaseId,verification_id:s.verificationId,version:s.version,created_at:s.createdAt,updated_at:s.updatedAt})});
  }

  async getGift(id:string):Promise<StarterGift|null>{
    const r=this.one(await this.request(`starter_gifts?id=eq.${encodeURIComponent(id)}&select=*`)); if(!r)return null;
    const items:Row[]=await this.request(`starter_gift_items?gift_id=eq.${encodeURIComponent(id)}&select=pattern_id&order=position.asc`);
    return {id:r.id,funnelSessionId:r.funnel_session_id,userId:r.user_id??null,source:'funnel',
      selectedGroundId:r.selected_ground_id,patternIds:items.map(x=>x.pattern_id),granted:100,remaining:r.remaining,
      patternSetHash:r.pattern_set_hash,issuedAt:r.issued_at,transferredAt:r.transferred_at??null,status:r.status};
  }

  async saveGift(gift:StarterGift,items:StarterGiftItem[]):Promise<void>{
    if(items.length!==gift.patternIds.length) throw new FunnelError('ENTITLEMENT_DENIED','gift item count mismatch');
    await this.rpc('funnel_save_starter_gift',{p_gift:{id:gift.id,funnelSessionId:gift.funnelSessionId,userId:gift.userId,
      selectedGroundId:gift.selectedGroundId,patternSetHash:gift.patternSetHash,granted:gift.granted,remaining:gift.remaining,
      issuedAt:gift.issuedAt,transferredAt:gift.transferredAt,status:gift.status,patternIdsCount:gift.patternIds.length},
      p_items:items.map(i=>({patternId:i.patternId,position:i.position,createdAt:i.createdAt}))});
  }

  async getTutorial(id:string):Promise<TutorialProgress|null>{
    const r=this.one(await this.request(`tutorial_progress?funnel_session_id=eq.${encodeURIComponent(id)}&select=*`)); if(!r)return null;
    return {funnelSessionId:r.funnel_session_id,userId:r.user_id??null,startedAt:r.started_at??null,patternSelected:r.pattern_selected,
      firstReleaseStarted:r.first_release_started,firstReleaseCompleted:r.first_release_completed,verificationCompleted:r.verification_completed,completedAt:r.completed_at??null};
  }

  async saveTutorial(p:TutorialProgress):Promise<void>{
    await this.request('tutorial_progress',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify({funnel_session_id:p.funnelSessionId,user_id:p.userId,started_at:p.startedAt,pattern_selected:p.patternSelected,
        first_release_started:p.firstReleaseStarted,first_release_completed:p.firstReleaseCompleted,verification_completed:p.verificationCompleted,completed_at:p.completedAt})});
  }

  async saveReferral(r:Referral):Promise<void>{
    await this.request('referrals',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify({id:r.id,inviter_user_id:r.inviterUserId,invitee_user_id:r.inviteeUserId,token:r.token,status:r.status,
        grant_amount:r.grantAmount,created_at:r.createdAt,opened_at:r.openedAt,signed_up_at:r.signedUpAt,grant_issued_at:r.grantIssuedAt})});
  }

  async getReferralByToken(token:string):Promise<Referral|null>{
    const r=this.one(await this.request(`referrals?token=eq.${encodeURIComponent(token)}&select=*`)); if(!r)return null;
    return {id:r.id,inviterUserId:r.inviter_user_id,inviteeUserId:r.invitee_user_id??null,token:r.token,status:r.status,grantAmount:25,
      createdAt:r.created_at,openedAt:r.opened_at??null,signedUpAt:r.signed_up_at??null,grantIssuedAt:r.grant_issued_at??null};
  }

  async appendEvent(e:FunnelEvent):Promise<void>{
    await this.request('funnel_events',{method:'POST',headers:{'Prefer':'return=minimal'},
      body:JSON.stringify({id:e.id,session_id:e.sessionId,user_id:e.userId,type:e.type,sequence:e.sequence,event_version:e.eventVersion,data:e.data,created_at:e.createdAt})});
  }

  async nextEventSequence(sessionId:string):Promise<number>{
    return Number(await this.rpc('funnel_next_event_sequence',{p_session_id:sessionId}));
  }

  async claimIdempotencyKey(scopeKey:string,operation:string,idempotencyKey:string,requestHash:string):
    Promise<{claimed:true}|{claimed:false;existing:IdempotencyClaim}>{
    const response=await this.fetchImpl(`${this.url}/rest/v1/idempotency_claims`,{method:'POST',headers:this.headers({'Prefer':'return=representation'}),
      body:JSON.stringify({scope_key:scopeKey,operation,idempotency_key:idempotencyKey,request_hash:requestHash,status:'in_progress'})});
    if(response.ok)return {claimed:true};
    if(response.status!==409)throw new Error(`Supabase ${response.status}: ${await response.text()}`);
    const r=this.one(await this.request(`idempotency_claims?scope_key=eq.${encodeURIComponent(scopeKey)}&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=*`));
    if(!r)throw new Error('idempotency conflict without existing claim');
    if(r.request_hash!==requestHash)throw new FunnelError('IDEMPOTENCY_HASH_MISMATCH',`${idempotencyKey} was already used for a different request`);
    return {claimed:false,existing:{scopeKey:r.scope_key,operation:r.operation,idempotencyKey:r.idempotency_key,requestHash:r.request_hash,
      status:r.status,resultReference:r.result_reference??null,createdAt:r.created_at,completedAt:r.completed_at??null}};
  }

  async completeIdempotencyClaim(scopeKey:string,idempotencyKey:string,resultReference:string):Promise<void>{
    await this.request(`idempotency_claims?scope_key=eq.${encodeURIComponent(scopeKey)}&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}`,{
      method:'PATCH',headers:{'Prefer':'return=minimal'},body:JSON.stringify({status:'completed',result_reference:resultReference,completed_at:new Date().toISOString()})});
  }

  async appendUsageLedgerEntry(e:UsageLedgerEntry):Promise<void>{
    await this.request('usage_ledger',{method:'POST',headers:{'Prefer':'return=minimal'},
      body:JSON.stringify({id:e.id,user_id:e.userId,source:e.source,operation:e.operation,pattern_id:e.patternId,release_id:e.releaseId,
        amount:e.amount,balance_after:e.balanceAfter,idempotency_key:e.idempotencyKey,created_at:e.createdAt})});
  }

  async getUsageBalance(userId:string,source:UsageSource):Promise<number>{
    const rows:Row[]=await this.request(`usage_ledger?user_id=eq.${encodeURIComponent(userId)}&source=eq.${encodeURIComponent(source)}&select=balance_after&order=created_at.desc&limit=1`);
    return rows.length?Number(rows[0].balance_after):1000;
  }

  async saveAttachmentChallenge(c:AttachmentChallenge):Promise<void>{
    await this.request('attachment_challenges',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify({id:c.id,session_id:c.sessionId,credential_hash:c.credentialHash,expires_at:c.expiresAt,used_at:c.usedAt,created_at:c.createdAt})});
  }

  async getAttachmentChallenge(sessionId:string):Promise<AttachmentChallenge|null>{
    const r=this.one(await this.request(`attachment_challenges?session_id=eq.${encodeURIComponent(sessionId)}&select=*&order=created_at.desc&limit=1`)); if(!r)return null;
    return {id:r.id,sessionId:r.session_id,credentialHash:r.credential_hash,expiresAt:r.expires_at,usedAt:r.used_at??null,createdAt:r.created_at};
  }

  async markAttachmentChallengeUsed(id:string):Promise<void>{
    await this.request(`attachment_challenges?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{'Prefer':'return=minimal'},
      body:JSON.stringify({used_at:new Date().toISOString()})});
  }
}
