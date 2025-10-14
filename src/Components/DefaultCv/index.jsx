/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/common";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Cv1 from "../Template/Cv1";
import Cv2 from "../Template/Cv2";
import Cv3 from "../Template/Cv3";
import Cv4 from "../Template/Cv4";
import Cv6 from "../Template/Cv6";
import Cv7 from "../Template/Cv7";
import Cv8 from "../Template/Cv8";

const DefaultCv = () => {
  const name = useParams();
  const userProfile = useSelector((state) => state.userProfile.data);
  const username = userProfile?.fetchedUsed?.userName;
  const [cvt, setCvt] = useState();
  const [dataa, setData] = useState();

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const res = await axios.get(`${apiUrl}/defaultCv/${name?.username}`);
        setData(res.data?.fetchedCvInfo?.defaultCvInfo);
        setCvt(res.data?.fetchedCvInfo?.templateName);
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };

    fetchCv();
  }, [username]);

  const cvOptions = {
    Cv1: Cv1,
    Cv2: Cv2,
    Cv3: Cv3,
    Cv4: Cv4,
    Cv6: Cv6,
    Cv7: Cv7,
    Cv8: Cv8,
  };

  const Component = cvOptions[cvt];

  return <div>{Component && <Component UserData={dataa} />}</div>;
};

export default DefaultCv;
