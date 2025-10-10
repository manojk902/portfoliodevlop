/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

// import { X } from "@mui/icons-material";
import axios from "axios";
import { apiUrl } from "../../utils/common";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DefaultCvDesign from "../Template/DefaultCvDesign";
import Cv1 from "../Template/Cv1";
import Cv2 from "../Template/Cv2";
import Cv3 from "../Template/Cv3";
import Cv4 from "../Template/Cv4";
import Cv6 from "../Template/Cv6";
import Cv7 from "../Template/Cv7";

const DefaultCv = ({ template = 'defaultCv' }) => {
  const name = useParams()
  const userProfile = useSelector((state) => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName;
  const [cvt, setCvt] = useState();
  const [dataa, setData] = useState();
  // console.log(name, "name");

  useEffect(() => {
    const fetchCv = async () => {
      const res = await axios.get(`${apiUrl}/defaultCv/${name?.username}`);
      // console.log("res from default cv", res);
      // console.log(res,"oip");
      setData(res.data?.fetchedCvInfo?.defaultCvInfo);
      setCvt(res.data?.fetchedCvInfo?.templateName)
      // console.log(res.data?.fetchedCvInfo?.templateName)
    }

    fetchCv()
  }, [username]);

  if (dataa === undefined) {
    return <div>Loading...</div>;
  }
  else {
    // console.log(dataa, "dataa from default cv");
  }
  const cvOptions = {
    "defaultCv": DefaultCvDesign,
    Cv1: Cv1,
    Cv2: Cv2,
    Cv3: Cv3,
    Cv4: Cv4,
    Cv6: Cv6,
    Cv7: Cv7,

  }

  const Component = cvOptions[cvt || template];

  if (!Component) {
    return <div>Design Not Foundds</div>;
  }


  return (
    <div>
      <Component UserData={dataa} />
    </div>
  );
};


export default DefaultCv;
