<script lang="ts">
  import type { OnResponseVestingAccounts } from '../../utils/types';

  export let vestingAccounts: OnResponseVestingAccounts;
</script>

<section class="mt-5">
  {#if vestingAccounts && !vestingAccounts.Error}
    {#if vestingAccounts.vesting_accounts.length}
      <h4 class="mb-4">Linked Address</h4>
      <div class="row">
        {#each vestingAccounts.vesting_accounts as account}
          <div class="col-6">
            <div class="card">
              <div class="card-body">
                <p class="mb-4">{account.address}</p>
                <button class="use-btn">Use This Address</button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</section>
