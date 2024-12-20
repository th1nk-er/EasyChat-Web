<template>
  <div class="toolbar-container">
    <div class="tool-box">
      <IconMood
        class="icon"
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
    <div class="tool-box">
      <IconImage class="icon" @click="imageUploader?.click()" />
      <input
        type="file"
        hidden
        ref="imageUploader"
        multiple="false"
        :disabled="disabled"
        accept="image/*"
        @change="handleImageUpload"
      />
    </div>
    <div class="tool-box">
      <IconFolder class="icon" @click="fileUploader?.click()" />
      <input
        type="file"
        hidden
        ref="fileUploader"
        multiple="true"
        :disabled="disabled"
        accept="*"
        @change="handleFileUpload"
      />
    </div>
    <div class="file-container">
      <el-tag
        round
        closable
        v-for="file in chatFiles"
        class="file-tag"
        v-if="chatFiles.length <= 3"
      >
        {{
          file.name.length > 15 ? file.name.slice(0, 15) + '...' : file.name
        }}</el-tag
      >
      <el-tag v-else closable round
        >{{ chatFiles[0].name }}等{{ chatFiles.length }}个文件</el-tag
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import type { ChatInfo } from '.';
import { useGroupStore } from '@/stores/group';
import { ChatType } from '@/api/chat/types';
import { GroupStatus } from '@/api/group/types';
const emit = defineEmits<{
  onEmojiSelected: [emoji: string];
  onImageUpload: [file: File, imgUrl: string];
}>();

const groupStore = useGroupStore();
const props = defineProps<{
  chatInfo: ChatInfo;
}>();
const chatFiles = defineModel('files', {
  type: Array as () => File[],
  default: [],
});
const disabled = computed(() => {
  if (props.chatInfo.chatType == ChatType.GROUP) {
    if (props.chatInfo.muted) return true;
    if (
      groupStore.getUserGroupVoById(props.chatInfo.chatId)?.status ==
      GroupStatus.DISBAND
    )
      return true;
  }
  return false;
});
const emojiSelectorVisible = ref(false);
const imageUploader = ref<HTMLInputElement>();
const onEmojiSelected = (emoji: any) => {
  if (disabled.value) return;
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
const fileUploader = ref<HTMLInputElement>();
const handleFileUpload = () => {
  const files = fileUploader.value?.files;
  if (files == undefined) return;
  if (files.length > 10) {
    ElMessage.error('一次最多上传10个文件');
    return;
  }
  chatFiles.value = Array.from(files);
};
</script>
<style lang="scss" scoped>
.toolbar-container {
  height: 30px;
  border-bottom: 2px solid var(--color-border);
  padding-left: 10px;
  display: flex;
  .tool-box {
    position: relative;
    .icon {
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
  .file-container {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    .file-tag {
      cursor: pointer;
    }
  }
}
</style>
