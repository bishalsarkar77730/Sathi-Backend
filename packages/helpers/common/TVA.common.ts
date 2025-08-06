import moment from 'moment';
import MomentTimezone from 'moment-timezone';
function getTime(): moment.Moment {
  const timezone = process.env.TIMEZONE ?? 'Asia/Kolkata';
  const currentTime = MomentTimezone().tz(timezone);
  return currentTime;
}
function timeConvert(item: Date): moment.Moment {
  const timezone = process.env.TIMEZONE ?? 'Asia/Kolkata';
  const currentTime = MomentTimezone(item).tz(timezone);
  return currentTime;
}
function simpleTimeFormatter(item: Date, format?: string): string {
  const timezone = process.env.TIMEZONE ?? 'Asia/Kolkata';
  const currentTime = MomentTimezone(item)
    .tz(timezone)
    .format(format ?? 'MMMM D, YYYY');
  return currentTime;
}
export const TVA = {
  getTime,
  timeConvert,
  simpleTimeFormatter,
};
