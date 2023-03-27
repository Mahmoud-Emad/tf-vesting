<script lang="ts">
  import http from '../../utils/axios';
  import { alertStore } from '../../utils/stores';
  import type { OnResponseVestingAccounts } from '../../utils/types';
  import { validateAddress } from '../../utils/validations';
  import Input from '../ui/Input.svelte';
  import Alert from '../ui/Alert.svelte';
  import VestingAccounts from './VestingAccounts.svelte';

  let addressValue: string;
  let isLoading = false;
  let vestingAccounts: OnResponseVestingAccounts;

  const onKeypress = async (e: { keyCode: number }) => {
    if (e.keyCode === 13) {
      // Enter pressed.
      if (validateAddress(addressValue).isValid) {
        isLoading = true;
        await http
          .post(
            'https://testnet.threefold.io/threefoldfoundation/vesting_service/vesting_accounts',
            { owner_address: addressValue },
          )
          .then((res) => {
            if (res) {
              vestingAccounts = res.data;
              if (vestingAccounts.Error) {
                alertStore.set({
                  message: vestingAccounts.Error,
                  isOpen: true,
                  className: 'danger',
                });
              } else {
                $alertStore.isOpen = false;
              }
            }
          });
        isLoading = false;
      }
    }
  };
</script>

<section>
  <div class="container">
    <div class="lock mt-5">
      <div class="row w-100">
        <div class="col-8">
          <Input
            bind:value={addressValue}
            label="Address"
            validation={validateAddress}
            className={'address-input'}
            bind:isLoading
            onKeyPress={(e) => onKeypress(e)}
          />
          {#if vestingAccounts && !vestingAccounts.vesting_accounts.length}
            <div class="invalid-feedback custom-invalid-feedback d-block">
              <span class="alert-link">
                Seems to be no linked address found.
              </span>
            </div>
          {/if}
          {#if $alertStore.isOpen}
            <Alert
              message={$alertStore.message}
              isOpen={$alertStore.isOpen}
              className={$alertStore.className}
            />
          {/if}
        </div>
        <div class="col-4 d-flex align-items-center p-relative">
          {#if vestingAccounts && !vestingAccounts.Error}
            <i class="fa-solid fa-lock-open unlocked" />
          {:else}
            <i class="fa-solid fa-lock locked" />
          {/if}
        </div>
        <small class="pl-2">
          <span class="text-danger">*</span>
          Write your address then press enter key.
        </small>
        <VestingAccounts {vestingAccounts} />
      </div>
    </div>
  </div>
</section>