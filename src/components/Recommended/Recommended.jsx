import React, { useEffect, useState } from "react";
import "./Recommended.css";
import { API_KEY, value_converter } from "../../data";
import { Link } from "react-router-dom";

const Recommended = ({ categoryId }) => {
  const [apiData, setApiData] = useState([]);

  const fetch_data = async () => {
    const releatedUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
    await fetch(releatedUrl)
      .then((resp) => resp.json())
      .then((data) => setApiData(data.items));
  };

  useEffect(() => {
    fetch_data();
  }, [categoryId]);

  return (
    <div className="recommended">
      {apiData &&
        apiData.map((item, index) => {
          return (
            <Link to={`/video/${item.snippet?.categoryId}/${item.id}`} className="side-video-list" key={index}>
              <img src={item.snippet.thumbnails.medium.url} alt="" />
              <div className="vid-info">
                <h4>{item.snippet.title}</h4>
                <p>{item.snippet.channelTitle}</p>
                <p>{value_converter(item.statistics.viewCount)} views</p>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default Recommended;
