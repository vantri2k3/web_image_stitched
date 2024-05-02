import React, { useState} from "react";
import axios from "axios";
import "./App.css";
import folderIcon from "./folder-upload.png";


const App = () => {
  const [newfiles, setNewFiles] = useState(null);
  const [fileCount, setFileCount] = useState(0); 
  const [urlFile, setUrlFile] = useState("");
  const [nameFile, setNameFile] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  

  const handleFile = (e) => {
    // Getting the files from the input
    const files = e.target.files;
  setNewFiles(files);
  setFileCount(files.length);
    };


  const handleCancel = () => {
    window.location.reload();
  }

const handleStitching= (e) => {
  e.preventDefault();
  
  if (!newfiles || newfiles.length === 0) {
    setShowNotification(true);
    return;
  } else {
    setShowNotification(false);
  }

  let formData = new FormData();

  for (let i = 0; i < newfiles.length; i++) {
    formData.append("image", newfiles[i]);
  }
  // formData.append("name", "Name");

  axios({
    url: "http://192.168.1.2:5000/upload",
    // headers: {
    //   'Access-Control-Allow-Origin': "*",
    // },
    method: "POST",
    data: formData,
    responseType : "arraybuffer"
  })
    .then((res) => {
      console.log("Received response from server:", res.data);
      const blob = new Blob([res.data],{type:'image/png'})
      const fileUrl = URL.createObjectURL(blob)
      setUrlFile(fileUrl)
      console.log(urlFile);
      document.querySelector('.download-section').style.display = 'block';
      document.querySelector('.remove-section').style.display = 'block';
      document.querySelector('.cancel-button').style.display = 'block';
    })
    .catch((err) => {
      // Xử lý lỗi nếu có
      console.error("Error communicating with Crow server:", err);
    });

};


const handleDownload = ()=>{
  if(urlFile !== ""){
    const link =  document.createElement('a')
    link.href = urlFile
    if(nameFile !== ""){
      link.download = `${nameFile}.png`
    }else{
      
      link.download = 'Stitched_Image.png'
    }
    link.click()
    setShowSuccessNotification(true); // Show success notification
    setTimeout(() => {
      window.location.reload(); // Reload the page after a delay
    }, 3000); // Adjust the delay time (in milliseconds) as needed
  }else{
    alert("No file to download")
  }
}

const handleRemoveObject = (e) => {
  e.preventDefault();

  if (!newfiles || newfiles.length === 0) {
    setShowNotification(true);
    return;
  } else {
    setShowNotification(false);
  }

  let formData = new FormData();
  formData.append("image", newfiles[0]);

  axios({
    url: "http://192.168.1.2:5000/remove",
    method: "POST",
    data: formData,
    responseType: "arraybuffer"
  })
    .then((res) => {
      const blob = new Blob([res.data], { type: 'image/png' });
      const fileUrl = URL.createObjectURL(blob);
      setUrlFile(fileUrl)
      console.log(urlFile);

      // Hiển thị ảnh kết quả sau khi xóa ghi đè lên ảnh image stitching
      const stitchedImage = document.querySelector('.preview-image');
      const removedImage = new Image();
      removedImage.src = fileUrl;
      removedImage.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = stitchedImage.width;
        canvas.height = stitchedImage.height;
        ctx.drawImage(stitchedImage, 0, 0);
        ctx.drawImage(removedImage, 0, 0, canvas.width, canvas.height);
        const mergedImageUrl = canvas.toDataURL(); // Convert canvas to data URL
        stitchedImage.src = mergedImageUrl; // Hiển thị ảnh kết quả sau khi ghi đè
      };
    })
    
    .catch((err) => {
      if (!newfiles || newfiles.length === 0) {
        setShowNotification(true);
        setErrorMsg("Vui lòng chọn ít nhất một file ảnh để xóa.");
        return;
      } else {
        setShowNotification(false);
      }
    });
  
}

return (
  

  <div className="app-container">
      <div className="background-image"></div>
      <div className="header-container">
        <h1 className="heading">Image Stitching</h1>
        <header className="header">
          <nav className="navbar">
            <ul className="nav-links">
              <li><a href="#policy">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"> <path d="M240 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM192 48a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32 80c17.7 0 32 14.3 32 32h8c13.3 0 24 10.7 24 24v16c0 1.7-.2 3.4-.5 5.1C280.3 229.6 320 286.2 320 352c0 88.4-71.6 160-160 160S0 440.4 0 352c0-65.8 39.7-122.4 96.5-146.9c-.4-1.6-.5-3.3-.5-5.1V184c0-13.3 10.7-24 24-24h8c0-17.7 14.3-32 32-32zm0 320a96 96 0 1 0 0-192 96 96 0 1 0 0 192zm192-96c0-25.9-5.1-50.5-14.4-73.1c16.9-32.9 44.8-59.1 78.9-73.9c-.4-1.6-.5-3.3-.5-5.1V184c0-13.3 10.7-24 24-24h8c0-17.7 14.3-32 32-32s32 14.3 32 32h8c13.3 0 24 10.7 24 24v16c0 1.7-.2 3.4-.5 5.1C600.3 229.6 640 286.2 640 352c0 88.4-71.6 160-160 160c-62 0-115.8-35.3-142.4-86.9c9.3-22.5 14.4-47.2 14.4-73.1zm224 0a96 96 0 1 0 -192 0 96 96 0 1 0 192 0zM368 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm80 48a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                Policy
                </a></li>
              <li><a href="#contact">
              <svg className= "icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path d="M96 0C60.7 0 32 28.7 32 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H96zM208 288h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V80zM496 192c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V336z"/></svg>
                Contact
              </a></li>
              <li><a href="#setting">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                Settings
              </a>
                </li>
            </ul>
          </nav>
        </header>
        
      </div>

      <label htmlFor="file-input" className="file-input-label">
      <img className="file-input-icon" src={folderIcon} alt="Choose File" />
      {newfiles ? (
        <span style={{ color: 'red' }}>{fileCount} files selected</span>
      ) : (
        <span>Click icon to choose files here</span>
      )}
      {/* Các phần tử ảnh đã chọn */}
      
      </label>

    <input
      id="file-input"
      type="file"
      multiple
      accept=".jpg, .png, .jpeg"
      onChange={handleFile}
      className="file-input"
    />

      <div className="file-input-container">
      {/* Nút Cancel */}
        <button onClick={handleCancel} className="cancel-button action-button">
          Cancel
        </button>
      
      {/* Nút Image Stitching */}
        <button onClick={handleStitching} className="stitch-button action-button">
          Image Stitching
        </button>
      </div>
      
      {showNotification && (
        <p className="notification">Please select an image to proceed!!!</p>
      )}

      
      
      {urlFile !== "" ? (
        <img src={urlFile} alt="new" className="preview-image" />
      ) : (
        <div></div>
      )}

      <div className="remove-section"> 
        <button onClick={handleRemoveObject} className="action-button">
          Remove Object  
        </button>
      </div>

      {errorMsg && <p>{errorMsg}</p>}
      
      <div className="download-section">
      <input
        placeholder="Enter file name for download..."
        onChange={(e) => setNameFile(e.target.value)}
      />
      <button onClick={handleDownload} className="action-button">
        Download Files
      </button>
      </div>
      
      {showSuccessNotification && (
        <div className="success-notification">
          <p>Download successful!</p>
        </div>
      )}
      

    </div>
);
};

export default App;