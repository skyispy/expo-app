// 현재 날짜와 시간을 "YYYYMMDDHHMMSS" 형식의 문자열로 반환하는 함수
export const getDateTimeString = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
};

// 게시글이나 댓글의 생성일과 수정일을 비교하여 "X년 전", "MM/DD", "X시간 전", "X분 전", "방금 전" 형식으로 반환하는 함수
export const timeSince = (createDate: Date | string, updateDate: Date | string) => {
  if (typeof createDate === 'string') {
    createDate = new Date(createDate);
  }
  if (typeof updateDate === 'string') {
    updateDate = new Date(updateDate);
  }
  const isUpdated = updateDate.getTime() > createDate.getTime();
  const baseDate = isUpdated ? updateDate : createDate;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - baseDate.getTime()) / 1000);

  let result;
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    result = `${interval}년 전`;
  } else if (seconds >= 2592000) {
    // 1개월 이상 1년 미만: MM/DD 형식
    result = `${baseDate.getMonth() + 1}/${baseDate.getDate()}`;
  } else if (seconds >= 86400) {
    // 1일 이상 1개월 미만: 먗일 전
    result = `${Math.floor(seconds / 86400)}일 전`;
  } else if (seconds >= 3600) {
    interval = Math.floor(seconds / 3600);
    result = `${interval}시간 전`;
  } else if (seconds >= 60) {
    interval = Math.floor(seconds / 60);
    result = `${interval}분 전`;
  } else {
    result = '방금 전';
  }

  if (isUpdated) {
    result += ' · 수정됨';
  }
  return result;
}

// 날짜 라벨 함수
export const getDateLabel = (date: string | Date): string => {
  const view = new Date(date);
  const now = new Date();

  const isToday = view.getFullYear() === now.getFullYear() &&
    view.getMonth() === now.getMonth() &&
    view.getDate() === now.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = view.getFullYear() === yesterday.getFullYear() &&
    view.getMonth() === yesterday.getMonth() &&
    view.getDate() === yesterday.getDate();

  if (isToday) return '오늘';
  if (isYesterday) return '어제';
  // 그 외 날짜
  return view.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
};