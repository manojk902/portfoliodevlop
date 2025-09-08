import React from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Button } from "@mui/material";

import CV1 from "./Cv1";
import CV2 from "./Cv2";
import CV3 from "./Cv3";
import CV4 from "./Cv4";
import CV5 from "./Cv5";
import CV6 from "./Cv6";

export default function Designpreview() {
  const { id } = useParams();

  const cvDesigns = [
    { id: 1, Component: CV1 },
    { id: 2, Component: CV2 },
    { id: 3, Component: CV3 },
    { id: 4, Component: CV4 },
    { id: 5, Component: CV5 },
    { id: 6, Component: CV6 },
  ];


  // Only using CV designs
  const designsToShow = cvDesigns;
  const design = designsToShow.find((d) => d.id === Number(id));

  if (!design) {
    return <div>Design Not Found</div>;
  }

  const { Component } = design;

  return (
    <Box sx={{ width: "100%", my: 2 }}>
      {/* Better Back Button Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          p: 2,
          borderBottom: "1px solid #eee",
          mb: 2,
          "@media print": {
            display: "none",
          },
        }}
      >
        <Button
          component={Link}
          to="/Designpage"
          variant="contained"
          color="primary"
        >
          ⬅ Back to Designs
        </Button>
      </Box>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Component />
      </Box>
    </Box>
  );
}