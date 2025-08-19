import Cv1 from "./Cv1";


const cvObject = {
  cv1: Cv1,
}

const CvCollection = ({cvName, ...props}) => {
  const Component = cvObject[cvName];

  if(Component){
    return <Component {...props} />;
  }
  return <div>NA</div>
}

export default CvCollection;
