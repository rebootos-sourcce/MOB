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
    const expectedVersion=existing?.version??null;
    const ok=await this.rpc('funnel_save_session',{
      p_session:{
        id:s.id,anonymousId:s.anonymousId,userId:s.userId,state:s.state,status:s.status,
        selectedGroundId:s.selectedGroundId,starterGiftId:s.starterGiftId,tutorialCompleted:s.tutorialCompleted,
        firstReleaseId:s.firstReleaseId,verificationId:s.verificationId,version:s.version,
        createdAt:s.createdAt,updatedAt:s.updatedAt,
      },
      p_expected_version:expectedVersion,
    });
    if(ok!==true) throw new FunnelError('STALE_VERSION',`session ${s.id} stale or conflicting write`);
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

  async transferStarterGift(giftId:string,userId:string,transferredAt:string):Promise<'transferred'|'already_owned'|'owned_by_other'|'not_found'>{
    const result=await this.rpc('funnel_transfer_starter_gift',{p_gift_id:giftId,p_user_id:userId,p_transferred_at:transferredAt});
    return String(result) as 'transferred'|'already_owned'|'owned_by_other'|'not_found';
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
    const result=await this.rpc('funnel_claim_idempotency',{
      p_scope_key:scopeKey,
      p_operation:operation,
      p_idempotency_key:idempotencyKey,
      p_request_hash:requestHash,
      p_now:new Date().toISOString(),
      p_lease_seconds:300,
    }) as Row;
    if(result?.claimed===true) return {claimed:true};
    return {
      claimed:false,
      existing:{
        scopeKey:String(result.scopeKey),
        operation:String(result.operation),
        idempotencyKey:String(result.idempotencyKey),
        requestHash:String(result.requestHash),
        status:String(result.status) as IdempotencyClaim['status'],
        resultReference:result.resultReference??null,
        createdAt:String(result.createdAt),
        completedAt:result.completedAt??null,
      },
    };
  }


  async completeIdempotencyClaim(scopeKey:string,idempotencyKey:string,resultReference:string):Promise<void>{
    await this.request(`idempotency_claims?scope_key=eq.${encodeURIComponent(scopeKey)}&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&status=eq.in_progress`,{
      method:'PATCH',headers:{'Prefer':'return=minimal'},body:JSON.stringify({status:'completed',result_reference:resultReference,completed_at:new Date().toISOString(),lease_expires_at:null})});
  }

  async appendUsageLedgerEntry(e:UsageLedgerEntry):Promise<void>{
    await this.request('usage_ledger',{method:'POST',headers:{'Prefer':'return=minimal'},
      body:JSON.stringify({id:e.id,user_id:e.userId,funnel_session_id:e.funnelSessionId,source:e.source,operation:e.operation,pattern_id:e.patternId,release_id:e.releaseId,
        amount:e.amount,balance_after:e.balanceAfter,idempotency_key:e.idempotencyKey,created_at:e.createdAt})});
  }

  async consumeUsage(e:UsageLedgerEntry):Promise<number|null>{
    if(e.amount!==1 || e.operation!=='OPEN_NEW_GROUND') throw new FunnelError('ENTITLEMENT_DENIED','invalid usage consumption');
    const balance=await this.rpc('funnel_consume_usage',{
      p_user_id:e.userId,
      p_funnel_session_id:e.funnelSessionId,
      p_source:e.source,
      p_operation:e.operation,
      p_pattern_id:e.patternId,
      p_release_id:e.releaseId,
      p_amount:e.amount,
      p_idempotency_key:e.idempotencyKey,
      p_entry_id:e.id,
      p_created_at:e.createdAt,
    });
    return balance===null ? null : Number(balance);
  }

  async getUsageBalance(userId:string,source:UsageSource):Promise<number>{
    const rows:Row[]=await this.request(`usage_ledger?user_id=eq.${encodeURIComponent(userId)}&source=eq.${encodeURIComponent(source)}&select=balance_after&order=created_at.desc&limit=1`);
    return rows.length?Number(rows[0].balance_after):0;
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
    const ok=await this.rpc('funnel_claim_attachment_challenge',{p_id:id});
    if(ok!==true) throw new FunnelError('ATTACHMENT_CREDENTIAL_INVALID','attachment credential already used or expired');
  }
}
