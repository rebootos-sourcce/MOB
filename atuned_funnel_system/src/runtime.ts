import { FunnelService } from './funnelService.js';
import { SupabaseFunnelRepository, type SupabaseFunnelRepositoryOptions } from './supabaseRepository.js';
import type { FunnelAdapters, IdentityAdapter, PatternCatalogAdapter, SourceAdapter, ReadingAdapter, ReleaseAdapter, VerificationAdapter, EntitlementAdapter, PaymentAdapter, Clock, IdGenerator } from './adapters.js';

export interface SupabaseFunnelRuntimeOptions extends SupabaseFunnelRepositoryOptions {
  identity: IdentityAdapter;
  catalog: PatternCatalogAdapter;
  source: SourceAdapter;
  reading: ReadingAdapter;
  release: ReleaseAdapter;
  verification: VerificationAdapter;
  entitlement: EntitlementAdapter;
  payment: PaymentAdapter;
  clock: Clock;
  ids: IdGenerator;
}

/**
 * The single composition seam for the funnel.
 *
 * The browser never receives the Supabase service-role key. The host runtime
 * supplies it here from its server-side secret/config boundary. All domain
 * orchestration remains FunnelService and all persistence remains the
 * FunnelRepository contract.
 */
export function createSupabaseFunnelService(options: SupabaseFunnelRuntimeOptions): FunnelService {
  const repo = new SupabaseFunnelRepository({
    url: options.url,
    serviceRoleKey: options.serviceRoleKey,
    fetchImpl: options.fetchImpl,
  });

  const adapters: FunnelAdapters = {
    repo,
    identity: options.identity,
    catalog: options.catalog,
    source: options.source,
    reading: options.reading,
    release: options.release,
    verification: options.verification,
    entitlement: options.entitlement,
    payment: options.payment,
    clock: options.clock,
    ids: options.ids,
  };

  return new FunnelService(adapters);
}
