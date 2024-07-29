<template>
  <el-dialog v-model="visible" title="新朋友" width="40%" class="dialog dark">
    <el-divider />
    <RequestList v-model:visible="showList" @on-selected="handleSelected" />
    <RequestDetails
      v-model:visible="showDetails"
      :item="selectedItem"
      @on-close="showList = true"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import type { RequestRecord } from "@/api/friend/type";
import { RequestList, RequestDetails } from ".";
const visible = defineModel("visible", { type: Boolean, default: false });
const showList = ref(true);
const showDetails = ref(false);
const selectedItem = ref({} as RequestRecord);
const handleSelected = (item: RequestRecord) => {
  selectedItem.value = item;
  showList.value = false;
  showDetails.value = true;
};
</script>

<style scoped lang="scss">
.dialog {
  background-color: var(--color-background);
  color:var(--color-text) * {
    background-color: var(--color-background);
  }
}

.request-details {
  &-content {
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: center;
    width: 100%;

    &__img-avatar {
      width: 100px;
      height: 100px;
    }
    .content-info {
      text-align: center;
      width: 90%;
      gap: 10px;
      &-addInfo {
        margin: 5px 0;
        text-align: left;
        width: 100%;
        height: 120px;
        padding: 5px;
        color: var(--color-subtitle);
        border: 2px solid var(--color-background-mute);
        background-color: var(--color-background-soft);
      }
    }
    .content-operation {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 90%;
      gap: 5px;
      &-button-group {
        display: flex;
      }
      .button-back {
        width: 100%;
      }
    }
  }
}
</style>
