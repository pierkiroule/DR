import ReactPlayer from "react-player";

export default function UniversalPlayer({ url, playing = true, loop = true, volume = 0.8 }) {
  return (
    <ReactPlayer
      url={url}
      playing={playing}
      loop={loop}
      volume={volume}
      controls={false}
      width="0"
      height="0"
    />
  );
}