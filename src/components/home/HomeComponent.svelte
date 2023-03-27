<script lang="ts">
  import http from '../../utils/axios';
  import { alertStore } from '../../utils/stores';
  import type { OnResponseVestingAccounts } from '../../utils/types';
  import { validateAddress } from '../../utils/validations';
  import Input from '../ui/Input.svelte';
  import Alert from '../ui/Alert.svelte';
  import Navbar from '../ui/Navbar.svelte';

  let value: string;
  let isLoading = false;
  let vestingAccounts: OnResponseVestingAccounts;
  let unLocked: HTMLElement;
  let locked: HTMLElement;

  const onKeypress = async (e: { keyCode: number }) => {
    if (e.keyCode === 13) {
      // Enter pressed.
      if (validateAddress(value).isValid) {
        isLoading = true;
        await http
          .post(
            'https://testnet.threefold.io/threefoldfoundation/vesting_service/vesting_accounts',
            { owner_address: value },
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
                updateLock(true);
              } else {
                $alertStore.isOpen = false;
                updateLock();
              }
            }
          });
        isLoading = false;
      }
    }
  };

  const updateLock = (error?: boolean) => {
    if (error) {
      locked.style.position = 'absolute';
      locked.style.top = '30px';
    }
  };
</script>

<section>
  <div class="nav" />
  <Navbar />
  <div class="container">
    <div class="lock mt-5">
      <div class="row w-100">
        <div class="col-8">
          <Input
            bind:value
            label="Address"
            validation={validateAddress}
            className={'address-input'}
            bind:isLoading
            onKeyPress={(e) => onKeypress(e)}
          />
          {#if $alertStore.isOpen}
            <Alert
              message={$alertStore.message}
              isOpen={$alertStore.isOpen}
              className={$alertStore.className + ' '}
            />
          {/if}
        </div>
        <div class="col-4 d-flex align-items-center p-relative">
          {#if vestingAccounts && !vestingAccounts.Error}
            <i class="fa-solid fa-lock-open unlocked" bind:this={unLocked} />
          {:else}
            <i class="fa-solid fa-lock locked" bind:this={locked} />
          {/if}
        </div>
        <small class="pl-2">
          <span class="text-danger">*</span>
          Write your address then press enter key.
        </small>
        <div class="container mt-5">
          {#if vestingAccounts && !vestingAccounts.Error}
            <h4 class="mb-4">Addresses Linked</h4>
            <div class="row">
              {#each vestingAccounts.vesting_accounts as account}
                <div class="col-6">
                  <div class="card">
                    <div class="card-body">
                      <p class="mb-0">{account.address}</p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>
