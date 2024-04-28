import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const {videoId} = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const fetchVideoData = async () => {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url)
      .then((response) => response.json())
      .then((data) => setApiData(data?.items[0]));
  };

  const fetchOtherData = async () => {
    const channelData = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData?.snippet?.channelId}&key=${API_KEY}`;
    await fetch(channelData)
      .then((response) => response.json())
      .then((data) => setChannelData(data?.items[0]));
    // fetching comment data from url //
    const commentUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
    await fetch(commentUrl)
      .then((response) => response.json())
      .then((data) => setCommentData(data?.items));
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
  }, [apiData]);

  return (
    <div className="play-video">
      {/* <video src={video} controls autoPlay muted></video> */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData?.snippet?.title}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics?.viewCount) : "16k"}
          views &bull;{" "}
          {apiData ? moment(apiData?.snippet.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : 144}
          </span>
          <span>
            <img src={dislike} alt="" />
          </span>
          <span>
            <img src={share} alt="" />
            10
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={channelData ? channelData.snippet?.thumbnails?.default?.url : ""}
          alt=""
        />
        <div>
          <p>{apiData ? apiData.snippet?.channelTitle : ""}</p>
          <span>
            {value_converter(
              channelData ? channelData.statistics?.subscriberCount : "1M"
            )}
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet?.description.slice(0, 250)
            : "Description Here"}
        </p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics?.commentCount) : 102}
        </h4>
        {commentData &&
          commentData?.map((item, index) => {
            return (
              <div className="comment" key={index}>
                <img
                  src={
                    item.snippet?.topLevelComment?.snippet?.authorProfileImageUrl
                  }
                  alt=""
                />
                <div>
                  <h3>
                    {item.snippet?.topLevelComment.snippet.authorDisplayName}{" "}
                    <span>1 day ago</span>
                  </h3>
                  <p>
                    {item.snippet?.topLevelComment.snippet.textDisplay}
                    <div className="comment-action">
                      <img src={like} alt="" />
                      <span>
                        {value_converter(
                          item.snippet.topLevelComment.snippet.likeCount
                        )}
                      </span>
                      <img src={dislike} alt="" />
                    </div>
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PlayVideo;
