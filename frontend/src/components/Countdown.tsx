import { default as ReactCountdown } from "react-countdown";

const Countdown = ({ endDateTime, update }: any) => {
  return <ReactCountdown date={endDateTime} onComplete={() => update()} />;
};

export default Countdown;
