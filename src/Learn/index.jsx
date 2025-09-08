import React, { useState, useEffect } from "react"; 
// React से useState और useEffect लाए

function Learn() {
  const [posts, setPosts] = useState([]); 
  // posts नाम का variable बनाया, शुरुआत में खाली array

  useEffect(() => { 
    // useEffect मतलब जब page load होगा तब ये चलेगा
    fetch("https://jsonplaceholder.typicode.com/posts") 
      // fetch() मतलब API को बुलाओ
      .then(response => response.json()) 
      // response को json में convert करो
      .then(data => setPosts(data)) 
      // जो data आया उसे posts में डाल दो
      .catch(error => console.log("Error:", error)); 
      // अगर कुछ गलती हुई तो console में दिखाओ
  }, []); 
  // [] मतलब ये सिर्फ पहली बार चलेगा (page load पर)

  return (
    <div>
      <h1>API Data</h1>
      {posts.map(post => (
        <div key={post.id} style={{border:"1px solid black", margin:"10px", padding:"10px"}}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default Learn;
