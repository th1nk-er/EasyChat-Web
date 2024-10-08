<template>
  <div class="input-container">
    <div class="input-container__content">
      <el-input
        v-model="message"
        type="textarea"
        resize="none"
        :rows="4"
        maxlength="1024"
        class="input-container__textarea"
        @keydown.enter.native="handleEnterDown"
        ref="messageInputRef"
      />
      <div class="upload-image" v-show="imgSrc != ''">
        <img :src="imgSrc" />
        <div class="icon-group">
          <IconZoomIn class="icon-zoom-in" @click="previewImgShow = true" />
          <IconDelete
            class="icon-delete"
            @click="
              imgSrc = '';
              imgFile = undefined;
            "
          />
        </div>
      </div>
    </div>
    <el-button
      class="input-container__button-send"
      type="primary"
      @click="$emit('onSendMessage')"
      >发送</el-button
    >
    <el-dialog
      v-model="previewImgShow"
      :align-center="true"
      style="display: flex; justify-content: center; padding: 10px"
      :fullscreen="true"
      @click="previewImgShow = false"
    >
      <img w-full :src="imgSrc" style="max-width: 100%" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
const message = defineModel('message', { type: String, required: true });
const imgSrc = defineModel('imageSrc', { type: String });
const imgFile = defineModel('imageFile', { type: File });
const emit = defineEmits<{
  onSendMessage: [];
}>();
const messageInputRef = ref<HTMLInputElement>();
/** 用户输入的消息 */
const handleEnterDown = (e: Event | KeyboardEvent) => {
  if (e instanceof KeyboardEvent) {
    if (e.shiftKey) {
      message.value += '\n';
    } else {
      e.preventDefault();
      emit('onSendMessage');
    }
  }
};
const previewImgShow = ref(false);
defineExpose({
  input: messageInputRef,
});
</script>
<style lang="scss" scoped>
.input-container {
  flex-grow: 1;
  padding: 3px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  &__content {
    display: flex;
    gap: 5px;
    .upload-image {
      position: relative;
      height: 120px;
      width: 120px;
      border-radius: 10px;
      &:hover {
        background-color: var(--color-text);
        img {
          opacity: 0.5;
        }
        .icon-delete,
        .icon-zoom-in {
          opacity: 1;
          fill: var(--color-background-mute);
        }
      }
      img {
        max-height: 100%;
        max-width: 100%;
        border-radius: 10px;
      }
      .icon-group {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
      }
      .icon-delete,
      .icon-zoom-in {
        cursor: pointer;
        opacity: 0;
      }
    }
    &__textarea {
      // width: 100%;
      font-size: 1.2rem;
    }
  }
}
</style>
