import { useEffect, useState } from "react";
// import Cv1 from "../Template/Cv1";
import Cv2 from "../Template/Cv2";
import Cv3 from "../Template/Cv3";
import Cv4 from "../Template/Cv4";
import Cv5 from "../Template/Cv5";
import Cv6 from "../Template/Cv6";
// import { X } from "@mui/icons-material";
import axios from "axios";
import { apiUrl } from "../../utils/common";
// import jsPDF from "jspdf";




const DefaultCv = ({ template = 'defaultCv' }) => {
  const [cvt, setCvt] = useState();
  useEffect(() => {
    const fetchCv = async () => {
      const res = await axios.get(`${apiUrl}/defaultCv/mukesh_277`);
      // console.log(res,"oip");
      
      setCvt(res.data?.fetchedCvInfo?.templateName)
    }

    fetchCv()
  }, []);
  console.log(cvt, "cvttttt");
  
  const cvOptions = {
    "defaultCv": cvt,
    Cv2: Cv2,
    Cv3: Cv3,
    Cv4: Cv4,
    Cv5: Cv5,
    Cv6: Cv6,
  }

  const Component = cvOptions[template];

  if (!Component) {
    return <div>Design Not Found</div>;
  }


  return (
    <div>
      <Component />
    </div>
  );
};


export default DefaultCv;
