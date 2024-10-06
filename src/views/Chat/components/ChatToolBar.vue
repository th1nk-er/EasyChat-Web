<template>
  <div class="toolbar-container">
    <div class="emoji-selector-container">
      <IconMood
        class="icon-mood"
        @click="emojiSelectorVisible = !emojiSelectorVisible"
      />
      <EmojiPicker
        :native="true"
        theme="auto"
        class="emoji-picker"
        :display-recent="true"
        :hide-group-names="true"
        v-show="emojiSelectorVisible"
        @select="onEmojiSelected"
      />
    </div>
    <div class="send-image-container">
      <IconImage class="icon-image" @click="imageUploader?.click()" />
      <input
        type="file"
        hidden
        ref="imageUploader"
        multiple="false"
        accept="image/*"
        @change="handleImageUpload"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
const emit = defineEmits<{
  onEmojiSelected: [emoji: string];
  onImageUpload: [file: File, imgUrl: string];
}>();

const emojiSelectorVisible = ref(false);
const imageUploader = ref<HTMLInputElement>();
const onEmojiSelected = (emoji: any) => {
  emojiSelectorVisible.value = false;
  emit('onEmojiSelected', emoji.i);
};
const handleImageUpload = () => {
  const file = imageUploader.value?.files?.[0];
  if (file == undefined) return;
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      emit('onImageUpload', file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
  if (imageUploader.value) imageUploader.value.value = '';
};
</script>
<style lang="scss" scoped>
.toolbar-container {
  height: 30px;
  border-bottom: 2px solid var(--color-border);
  padding-left: 10px;
  display: flex;
  .emoji-selector-container {
    position: relative;
    .icon-mood {
      cursor: pointer;
      &:hover {
        fill: dodgerblue;
      }
    }
    .emoji-picker {
      position: absolute;
      bottom: 110%;
    }
  }
  .send-image-container {
    .icon-image {
      cursor: pointer;
      &:hover {
        fill: dodgerblue;
      }
    }
  }
}
</style>
