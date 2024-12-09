<template>
  <IconFolderZip v-if="isFileZip()" />
  <IconWord v-else-if="isFileWord()" />
  <IconPDF v-else-if="isFilePDF()" />
  <IconExcel v-else-if="isFileExcel()" />
  <IconPPT v-else-if="isFilePPT()" />
  <IconImage v-else-if="isImage()" />
  <IconQuestionMark v-else />
</template>
<script setup lang="ts">
const props = defineProps<{
  filename: string;
}>();
const fileExtension = props.filename.split('.').pop();
const isFileZip = () => {
  return (
    fileExtension === 'zip' ||
    fileExtension === 'rar' ||
    fileExtension === '7z' ||
    fileExtension === 'tar' ||
    fileExtension === 'gz'
  );
};
const isFileWord = () => {
  return fileExtension === 'doc' || fileExtension === 'docx';
};
const isFilePDF = () => {
  return fileExtension === 'pdf';
};
const isFileExcel = () => {
  return (
    fileExtension === 'xls' ||
    fileExtension === 'xlsx' ||
    fileExtension === 'csv'
  );
};
const isFilePPT = () => {
  return fileExtension === 'ppt' || fileExtension === 'pptx';
};
const isImage = () => {
  return (
    fileExtension === 'jpg' ||
    fileExtension === 'jpeg' ||
    fileExtension === 'png' ||
    fileExtension === 'gif' ||
    fileExtension === 'bmp'
  );
};
</script>
