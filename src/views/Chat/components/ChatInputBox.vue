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
        <IconDelete
          class="icon-delete"
          @click="
            imgSrc = '';
            imgFile = undefined;
          "
        />
      </div>
    </div>
    <el-button
      class="input-container__button-send"
      type="primary"
      @click="$emit('onSendMessage')"
      >发送</el-button
    >
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
        .icon-delete {
          opacity: 1;
          fill: var(--color-background-mute);
        }
      }
      img {
        height: 100%;
        border-radius: 10px;
      }
      .icon-delete {
        cursor: pointer;
        position: absolute;
        top: 45%;
        left: 45%;
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
