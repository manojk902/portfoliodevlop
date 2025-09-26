/* eslint-disable react-hooks/exhaustive-deps */

import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";



import Cv1 from "./Cv1";
import Cv3 from "./Cv3";
import Cv4 from "./Cv4";
import DefaultCvDesign from "./DefaultCvDesign";
import Cv2 from "./Cv2";
// import CV6 from "./Cv5";

export default function Designpreview() {
  const { id } = useParams();

  const cvDesigns = [
    { id: 1, Component: Cv1 },
    { id: 2, Component: Cv2 },
    { id: 3, Component: Cv3 },
    { id: 4, Component: Cv4 },
    { id: 5, Component: DefaultCvDesign },
  ];

  // ✅ Safe find with memo + console log
  const design = useMemo(() => {
    const found = cvDesigns.find((d) => d.id === Number(id));
    console.log("🟢 Preview Page ID:", id, "Found Design:", found);
    return found;
  }, [id]);

  if (!design) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error">Design Not Found</Typography>
        <Button component={Link} to="/Designpage" variant="contained" sx={{ mt: 2 }}>
          ⬅ Back to Designs
        </Button>
      </Box>
    );
  }

  const { Component } = design;

  return (
    <Box sx={{ width: "100%", my: 2 }}>
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
        <Button component={Link} to="/Designpage" variant="contained" color="primary">
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
