export function bufferToFile(
  buffer: Buffer,
  fileName: string = '/files/file.jpeg',
  fileType: string = 'image/jpeg'
) {
  // 버퍼를 Uint8Array로 변환
  const uint8Array = new Uint8Array(buffer);

  // Uint8Array를 Blob으로 변환
  const blob = new Blob([uint8Array], { type: fileType });

  // Blob을 사용하여 File 객체 생성
  const file = new File([blob], fileName);

  // 파일 다운로드를 위한 가상 링크 생성
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = fileName;

  // 가상 링크를 body에 추가하고 클릭하여 다운로드 시도
  document.body.appendChild(a);
  a.click();

  // 다운로드 후 가상 링크 제거
  document.body.removeChild(a);
}
