/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useTheme,
  Tooltip,
  Chip,
  Avatar,
  Divider,
  Paper,
  Container,
  Stack,
  Checkbox,
  FormControlLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import MDEditor from '@uiw/react-md-editor';
// import '@uiw/react-markdown-preview/dist/markdown.css';
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import {
  ExpandMore,
  ExpandLess,
  DragIndicator,
  Edit,
  Add,
  Delete,
} from "@mui/icons-material";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { apiUrl } from "../../../utils/common";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import { green } from "@mui/material/colors";

// Define section types with fields, required fields, and whether they allow multiple entries
const sectionTypes = {
  Education: {
    title: "Education",
    fields: [
      "college",
      "course",
      "fieldOfStudy",
      "startDate",
      "endDate",
      "currentlyStudying",
      "grade",
      "location",
    ],
    required: ["college"],
    single: false,
    icon: "🎓",
  },
  Experience: {
    title: "Experience",
    fields: [
      "jobTitle",
      "company",
      "location",
      "startDate",
      "endDate",
      "currentlyWorking",
      "description",
    ],
    required: ["jobTitle", "company"],
    single: false,
    icon: "💼",
  },
  Skill: {
    title: "Skills",
    fields: ["skill", "rating"],
    required: ["skill", "rating"],
    single: false,
    icon: "⚡",
  },
  Certification: {
    title: "Certifications",
    fields: ["name", "institute", "issueDate"],
    required: ["name"],
    single: false,
    icon: "📜",
  },
  Language: {
    title: "Languages",
    fields: ["language", "proficiency"],
    required: ["language", "proficiency"],
    single: false,
    icon: "🌐",
  },
  Project: {
    title: "Projects",
    fields: ["name", "description", "url", "technologies", "projectImages"],
    required: ["name"],
    single: false,
    icon: "🚀",
  },
  Summary: {
    title: "Summary",
    fields: ["summary"],
    required: ["summary"],
    single: true,
    icon: "📝",
  },
  Achievement: {
    title: "Achievements",
    fields: ["title"],
    required: ["title"],
    single: false,
    icon: "🏆",
  },
  Interest: {
    title: "Interests",
    fields: ["interest"],
    required: ["interest"],
    single: false,
    icon: "❤️",
  },
  Award: {
    title: "Awards",
    fields: ["title", "issuer", "date", "description"],
    required: ["title"],
    single: false,
    icon: "⭐",
  },
};

const ItemType = "SECTION";

// Format date for display
const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "MMM yyyy");
  } catch {
    return dateString;
  }
};
// Calculate duration between two dates
const calculateDuration = (startDate, endDate, currentlyActive = false) => {
  if (!startDate) return "";

  const start = parseISO(startDate);
  const end = endDate && !currentlyActive ? parseISO(endDate) : new Date();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (months < 12) {
    return `${months} mos`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0
      ? `${years} yrs ${remainingMonths} mos`
      : `${years} yrs`;
  }
};

// Preview component for collapsed section - LinkedIn Style
const SectionPreview = ({ section, onEdit }) => {
  const getPreviewContent = () => {
    // console.log(section,"opop");

    if (
      !section.data ||
      (Array.isArray(section.data) && section.data.length === 0)
    ) {
      return (
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ fontSize: "0.8rem" }}
        >
          No information added
        </Typography>
      );
    }

    if (section.name === "Summary") {
      return (
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.4, color: "text.primary", fontSize: "0.85rem" }}
        >
          {section.data}
        </Typography>
      );
    }

    if (Array.isArray(section.data)) {
      return (
        // <Stack spacing={1.5}>
        <>
        {section.data.map((item, index) => (
          console.log(item,"itemitemitem"),
          <Box key={index}>
            {/* Experience Section */}
            {section.name === "Experience" && (
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  color="text.primary"
                  sx={{ fontSize: "0.9rem", mb: 0.25 }}
                >
                  {item.jobTitle}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  gutterBottom
                  sx={{ fontSize: "0.8rem" }}
                >
                  {item.company} · Full-time
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: "0.75rem" }}
                >
                  {formatDisplayDate(item.startDate)} -{" "}
                  {item.currentlyWorking
                    ? "Present"
                    : formatDisplayDate(item.endDate)}{" "}
                  ·{" "}
                  {calculateDuration(
                    item.startDate,
                    item.endDate,
                    item.currentlyWorking
                  )}
                </Typography>
                {item.location && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {item.location} · On-site
                  </Typography>
                )}
                {item.description && (
                  <Box sx={{ mt: 0.5 }}>
                    <MDEditor.Markdown source={item.description || ""} />
                  </Box>
                )}
              </Box>
            )}

            {/* Education Section */}
            {section.name === "Education" && (
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  color="text.primary"
                  sx={{ fontSize: "0.9rem", mb: 0.25 }}
                >
                  {item.college}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  gutterBottom
                  sx={{ fontSize: "0.8rem" }}
                >
                  {item.course}
                  {item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ""}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {formatDisplayDate(item.startDate)} -{" "}
                  {item.currentlyStudying
                    ? "Present"
                    : formatDisplayDate(item.endDate)}
                </Typography>
              </Box>
            )}

            {/* Skills Section - Show all skills in one line outside*/}
            {section.name === "Skill" && index === 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.2 }}>
                {section.data.map((skillItem, skillIndex) => (
                  <Chip
                    key={skillIndex}
                    label={skillItem.skill}
                    variant="outlined"
                    sx={{
                      borderRadius: 0.8,
                      m: 0.1,
                      fontSize: "0.7rem",
                      height: 22,

                    }}
                    size="small"
                  />
                ))}
              </Box>
            )}

            {/* Languages Section - Show all languages in one line */}
            {section.name === "Language" && index === 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.2 }}>
                {section.data.map((languageItem, languageIndex) => (
                  <Chip
                    key={languageIndex}
                    label={`${languageItem.language} - ${languageItem.proficiency}`}
                    variant="outlined"
                    sx={{
                      borderRadius: 0.8,
                      m: 0.1,
                      fontSize: "0.7rem",
                      height: 22,
                    }}
                    size="small"
                  />
                ))}
              </Box>
            )}

            {/* Projects Section */}
            {section.name === "Project" && (
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  color="text.primary"
                  sx={{ fontSize: "0.9rem", mb: 0.25 }}
                >
                  {item.name}
                </Typography>
                {item.description && (
                  <Box sx={{ mt: 0.5 }}>
                    <MDEditor.Markdown source={item.description || ""} />
                  </Box>
                )}
              </Box>
            )}

            {/* Other Sections */}
            {![
              "Experience",
              "Education",
              "Skill",
              "Language",
              "Project",
            ].includes(section.name) && (
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ fontSize: "0.85rem", width: '10%' }}
                >
                  {item[sectionTypes[section.name].fields[0]] ||
                    `Entry #${index + 1}`}
                </Typography>
              )}

            {/* Divider between entries except for the last one */}
            {index < section.data.length - 1 &&
              !["Skill", "Language"].includes(section.name) && (
                <Divider sx={{ my: 1 }} />
              )}
          </Box>
        ))}
        
        </>
        // </Stack>
      );
    }

    return null;
  };

  return <Box sx={{ width: "100%" }}>{getPreviewContent()}</Box>;
};

// Confirmation Dialog Component
const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1, fontSize: "1rem" }}>{title}</DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Typography variant="body2">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          size="small"
          sx={{ textTransform: "none" }}
        >
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Component for a draggable section
const DraggableSection = ({
  section,
  index,
  moveSection,
  toggleSection,
  expandedSections,
  handleSectionChange,
  removeSection,
  removeEntry,
  addSectionEntry,
  errors,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  const isExpanded = expandedSections[section.name];
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: null, // 'section' or 'entry'
    entryIndex: null,
  });

  const handleRemoveClick = (type, entryIndex = null) => {
    setDeleteDialog({
      open: true,
      type,
      entryIndex,
    });
  };

  const handleConfirmRemove = () => {
    if (deleteDialog.type === "section") {
      removeSection(section.name);
    } else if (deleteDialog.type === "entry") {
      removeEntry(section.name, deleteDialog.entryIndex);
    }
    setDeleteDialog({ open: false, type: null, entryIndex: null });
  };

  const getDeleteMessage = () => {
    if (deleteDialog.type === "section") {
      return `Are you sure you want to remove the ${sectionTypes[section.name].title
        } section? This action cannot be undone.`;
    } else if (deleteDialog.type === "entry") {
      const entry = section.data[deleteDialog.entryIndex];
      let entryName = `Entry #${deleteDialog.entryIndex + 1}`;

      if (section.name === "Experience" && entry.jobTitle) {
        entryName = `${entry.jobTitle} at ${entry.company || "Unknown Company"
          }`;
      } else if (section.name === "Education" && entry.college) {
        entryName = entry.college;
      } else if (section.name === "Project" && entry.name) {
        entryName = entry.name;
      } else if (entry[sectionTypes[section.name].fields[0]]) {
        entryName = entry[sectionTypes[section.name].fields[0]];
      }

      return `Are you sure you want to remove "${entryName}" from ${sectionTypes[section.name].title
        }?`;
    }
    return "";
  };

  return (
    <>
      <Paper
        ref={(node) => drag(drop(node))}
        sx={{
          mb: 1.5,
          borderRadius: 1,
          opacity: isDragging ? 0.5 : 1,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          },
          overflow: "hidden",
          backgroundColor: "transparent",
          backgroundImage: "none",
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderBottom: isExpanded ? "1px solid" : "none",
            borderColor: "divider",
            backgroundColor: "transparent",
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",

              flexDirection: "row",
              mb: isExpanded ? 0 : 1,
            }}
          >
            {/* for each section */}
            <Box sx={{ display: "flex", backgroundColor: "", alignItems: "center", height: "auto", gap: 1, flex: 1 }}>
              {/* box for avatar and drag icon start*/}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <DragIndicator sx={{ color: "text.secondary", fontSize: 16 }} />
                <Avatar
                  sx={{
                    bgcolor: "primary",
                    width: 32,
                    height: 32,
                    fontSize: "0.8rem",
                  }}
                >
                  {sectionTypes[section.name].icon}
                </Avatar>
              </Box>
              {/* box for avatar and drag icon end */}
              <Box sx={{}}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ fontSize: "1rem", mb: 0.25 }}
                >
                  {sectionTypes[section.name].title}
                </Typography>
                {!isExpanded && (
                  <SectionPreview
                    section={section}
                    onEdit={() => toggleSection(section.name)}
                  />
                )}
              </Box>
            </Box>

            {/* outer box delete and edit start*/}
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              {/* outer box delete and edit */}
              <Tooltip title="Delete" arrow placement="bottom-start">
                <Button
                  // variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.75rem",
                    borderRadius: 1,
                    minWidth: "auto",
                    px: 0.75,
                    py: 0.5,
                  }}
                  onClick={() => handleRemoveClick("section")}
                >
                  {/* Remove */}
                </Button>
              </Tooltip>
              <Tooltip title="Edit" arrow placement="bottom-end">
                <Button
                  variant={isExpanded ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  startIcon={isExpanded ? <CheckCircleIcon /> : <Edit />}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.75rem",
                    borderRadius: 1,
                    minWidth: 60,
                    px: 1.4,
                    py: 0.4,
                    // px: 1,
                    // py: 0.5,
                  }}
                  onClick={() => toggleSection(section.name)}
                >
                  {isExpanded ? "Done" : "Edit"}
                </Button>
              </Tooltip>
            </Box>
          </Box>
          {/* outer box delete and edit end*/}


          {/* Section Content - Show form when expanded */}
          <Collapse in={isExpanded}>
            <Box sx={{ mt: 1.5 }}>
              {sectionTypes[section.name].single ? (
                <Box sx={{ mb: 1, border: 1 }}>
                  <TextField
                    fullWidth
                    label="Summary"
                    multiline
                    rows={4}
                    value={section.data ?? ""}
                    onChange={(e) =>
                      handleSectionChange(
                        section.name,
                        index,
                        0,
                        "summary",
                        e.target.value
                      )
                    }
                    variant="outlined"
                    error={!!errors[`${section.name}_0_summary`]}
                    helperText={errors[`${section.name}_0_summary`]}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: "white",
                        fontSize: "0.85rem",
                      },
                    }}
                  />
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {(section.data || []).map((entry, entryIndex) => (
                    <Paper
                      key={entryIndex}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        p: 1.5,
                        backgroundColor: "white",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="text.primary"
                          sx={{ fontSize: "0.9rem" }}
                        >
                          {section.name === "Experience"
                            ? `${entry.jobTitle || "Untitled"} at ${entry.company || "Unknown Company"
                            }`
                            : section.name === "Education"
                              ? entry.college || "Untitled Education"
                              : section.name === "Project"
                                ? entry.name || "Untitled Project"
                                : `Entry #${entryIndex + 1}`}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          sx={{
                            textTransform: "none",
                            fontSize: "0.65rem",
                            borderRadius: 1,
                            px: 1,
                            py: 0.25,
                          }}
                          onClick={() => handleRemoveClick("entry", entryIndex)}
                        >
                          Remove
                        </Button>
                      </Box>

                      <Grid container spacing={1.5}>
                        {sectionTypes[section.name].fields.map((field) => {
                          const fieldError =
                            errors[`${section.name}_${entryIndex}_${field}`];
                          return (
                            <Grid
                              item
                              xs={12}
                              md={field === "description" ? 12 : 6}
                              key={field}
                            >
                              <Box sx={{ mb: 1 }}>
                                {field === "description" ? (
                                  <Box sx={{ '& .wmde-markdown': { background: 'white' } }}>
                                    <MDEditor
                                      value={entry[field] || ""}
                                      onChange={(val) =>
                                        handleSectionChange(
                                          section.name,
                                          index,
                                          entryIndex,
                                          field,
                                          val ?? ""
                                        )
                                      }
                                      height={180}
                                    />
                                    {fieldError && (
                                      <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{ fontSize: "0.7rem", mt: 0.5, display: 'block' }}
                                      >
                                        {fieldError}
                                      </Typography>
                                    )}
                                  </Box>
                                ) : field === "currentlyWorking" &&
                                  section.name === "Experience" ? (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={entry[field] || false}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            section.name,
                                            index,
                                            entryIndex,
                                            field,
                                            e.target.checked
                                          )
                                        }
                                        color="primary"
                                        size="small"
                                      />
                                    }
                                    label="I am currently working in this role"
                                    sx={{ fontSize: "0.8rem" }}
                                  />
                                ) : field === "currentlyStudying" &&
                                  section.name === "Education" ? (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={entry[field] || false}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            section.name,
                                            index,
                                            entryIndex,
                                            field,
                                            e.target.checked
                                          )
                                        }
                                        color="primary"
                                        size="small"
                                      />
                                    }
                                    label="I am currently studying here"
                                    sx={{ fontSize: "0.8rem" }}
                                  />
                                ) : field === "proficiency" &&
                                  section.name === "Language" ? (
                                  <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontSize: "0.85rem" }}>
                                      Proficiency
                                    </InputLabel>
                                    <Select
                                      label="Proficiency"
                                      value={entry[field] || ""}
                                      onChange={(e) =>
                                        handleSectionChange(
                                          section.name,
                                          index,
                                          entryIndex,
                                          field,
                                          e.target.value
                                        )
                                      }
                                      sx={{
                                        borderRadius: 1,
                                        fontSize: "0.85rem",
                                      }}
                                      error={!!fieldError}
                                    >
                                      <MenuItem
                                        value="normal"
                                        sx={{ fontSize: "0.85rem" }}
                                      >
                                        Normal
                                      </MenuItem>
                                      <MenuItem
                                        value="good"
                                        sx={{ fontSize: "0.85rem" }}
                                      >
                                        Good
                                      </MenuItem>
                                      <MenuItem
                                        value="very-good"
                                        sx={{ fontSize: "0.85rem" }}
                                      >
                                        Very Good
                                      </MenuItem>
                                      <MenuItem
                                        value="excellent"
                                        sx={{ fontSize: "0.85rem" }}
                                      >
                                        Excellent
                                      </MenuItem>
                                    </Select>
                                    {fieldError && (
                                      <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{
                                          fontSize: "0.7rem",
                                          mt: 0.5,
                                          display: "block",
                                        }}
                                      >
                                        {fieldError}
                                      </Typography>
                                    )}
                                  </FormControl>
                                ) : (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label={
                                      field.charAt(0).toUpperCase() +
                                      field.slice(1)
                                    }
                                    type={
                                      /date$/i.test(field)
                                        ? "date"
                                        : field === "rating"
                                          ? "number"
                                          : "text"
                                    }
                                    multiline={field === "summary"}
                                    rows={field === "summary" ? 4 : 1}
                                    value={
                                      field === "technologies" ||
                                        field === "projectImages"
                                        ? Array.isArray(entry[field])
                                          ? entry[field].join(", ")
                                          : entry[field] || ""
                                        : /date$/i.test(field) && entry[field]
                                          ? (() => {
                                            try {
                                              const parsed = parseISO(
                                                entry[field]
                                              );
                                              return isNaN(parsed)
                                                ? ""
                                                : format(parsed, "yyyy-MM-dd");
                                            } catch {
                                              return "";
                                            }
                                          })()
                                          : entry[field] || ""
                                    }
                                    onChange={(e) => {
                                      const value =
                                        field === "technologies" ||
                                          field === "projectImages"
                                          ? e.target.value
                                            .split(",")
                                            .map((item) => item.trim())
                                            .filter((item) => item)
                                          : e.target.value;
                                      handleSectionChange(
                                        section.name,
                                        index,
                                        entryIndex,
                                        field,
                                        value
                                      );
                                    }}
                                    variant="outlined"
                                    InputLabelProps={
                                      /date$/i.test(field)
                                        ? { shrink: true }
                                        : undefined
                                    }
                                    inputProps={
                                      field === "rating"
                                        ? { min: 1, max: 5 }
                                        : undefined
                                    }
                                    disabled={
                                      (field === "endDate" &&
                                        entry.currentlyWorking) ||
                                      (field === "endDate" &&
                                        entry.currentlyStudying)
                                    }
                                    error={!!fieldError}
                                    helperText={fieldError}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 1,
                                        backgroundColor: "white",
                                        fontSize: "0.85rem",
                                      },
                                      "& .MuiInputLabel-root": {
                                        fontSize: "0.85rem",
                                      },
                                      "& .MuiFormHelperText-root": {
                                        fontSize: "0.7rem",
                                      },
                                    }}
                                  />
                                )}
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              )}

              {!sectionTypes[section.name].single && (
                <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.75rem",
                      borderRadius: 1,
                      px: 1.4,
                      py: 0.4,
                      borderColor: "primary.main",
                      color: "primary.main",
                      backgroundColor: "white",
                      "&:hover": {
                        borderColor: "primary.dark",
                        backgroundColor: "primary.light",
                      },
                    }}
                    onClick={() => addSectionEntry(section.name)}
                  >
                    --Add {sectionTypes[section.name].title.slice(0, -1)}
                  </Button>

                  {/* mmm */}

                  <Button
                    variant={isExpanded ? "outlined" : "contained"}
                    color="primary"
                    size="small"
                    startIcon={isExpanded ? <CheckCircleIcon /> : <Edit />}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.75rem",
                      borderRadius: 1,
                      minWidth: 60,
                      px: 1.4,
                      py: 0.4,
                      // px: 1,
                      // py: 0.5,
                    }}
                    onClick={() => toggleSection(section.name)}
                  >
                    {isExpanded ? "Done" : "Edit"}
                  </Button>
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={() =>
          setDeleteDialog({ open: false, type: null, entryIndex: null })
        }
        onConfirm={handleConfirmRemove}
        title="Confirm Removal"
        message={getDeleteMessage()}
      />
    </>
  );
};

// Personal Information Component
const PersonalInformationSection = ({ group, handleInputChange, errors }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper
      sx={{
        mb: 2,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderBottom: expanded ? "1px solid" : "none",
          borderColor: "divider",
          backgroundColor: "#fefefe",
        }}
      >
        {/* Personal Info Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: expanded ? 0 : 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Avatar
                sx={{
                  bgcolor: "primary",
                  width: 32,
                  height: 32,
                  fontSize: "0.8rem",
                }}
              >
                👤
              </Avatar>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="text.primary"
                sx={{ fontSize: "1rem", mb: 0.25 }}
              >
                Personal Information
              </Typography>
              {!expanded && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {group.firstName} {group.lastName}
                    {group.designation && ` • ${group.designation}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {group.email} {group.phoneNo && ` • ${group.phoneNo}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {group.city && `${group.city}`}
                    {group.state && `, ${group.state}`}
                    {group.country && `, ${group.country}`}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Button
            variant={expanded ? "outlined" : "contained"}
            size="small"
            startIcon={expanded ? <CheckCircleIcon /> : <Edit />}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              borderRadius: 1,
              minWidth: 60,
              px: 1,
              py: 0.5,
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Done" : "Edit"}
          </Button>
        </Box>

        {/* Personal Info Form */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 1.5 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1.5, fontSize: "0.9rem" }}
              color="text.primary"
            >
              Basic Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name *"
                  value={group.firstName || ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "transparent",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name *"
                  value={group.lastName || ""}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      // backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Designation *"
                  value={group.designation || ""}
                  onChange={(e) =>
                    handleInputChange("designation", e.target.value)
                  }
                  error={!!errors.designation}
                  helperText={errors.designation}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      // backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email *"
                  type="email"
                  value={group.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      // backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number *"
                  value={group.phoneNo || ""}
                  onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      // backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Date of Birth"
                  type="date"
                  value={group.dob || ""}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dob}
                  helperText={errors.dob}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      // backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: "0.85rem" }}>Gender</InputLabel>
                  <Select
                    label="Gender"
                    value={group.gender || ""}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    sx={{
                      borderRadius: 1,
                      fontSize: "0.85rem",
                      // backgroundColor: "white",
                    }}
                  >
                    <MenuItem value="Male" sx={{ fontSize: "0.85rem" }}>
                      Male
                    </MenuItem>
                    <MenuItem value="Female" sx={{ fontSize: "0.85rem" }}>
                      Female
                    </MenuItem>
                    <MenuItem value="Other" sx={{ fontSize: "0.85rem" }}>
                      Other
                    </MenuItem>
                    <MenuItem
                      value="Prefer not to say"
                      sx={{ fontSize: "0.85rem" }}
                    >
                      Prefer not to say
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mt: 2, mb: 1.5, fontSize: "0.9rem" }}
              color="text.primary"
            >
              Address Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Street Address"
                  value={group.street || ""}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  error={!!errors.street}
                  helperText={errors.street}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="City *"
                  value={group.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  error={!!errors.city}
                  helperText={errors.city}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="State *"
                  value={group.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  error={!!errors.state}
                  helperText={errors.state}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="ZIP / Postal Code *"
                  value={group.zip || ""}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  error={!!errors.zip}
                  helperText={errors.zip}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Country *"
                  value={group.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  error={!!errors.country}
                  helperText={errors.country}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mt: 2, mb: 1.5, fontSize: "0.9rem" }}
              color="text.primary"
            >
              Social Links
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="LinkedIn Profile URL"
                  value={group.socialLinks?.[0] || ""}
                  onChange={(e) => {
                    const newLinks = [...(group.socialLinks || [])];
                    newLinks[0] = e.target.value;
                    handleInputChange("socialLinks", newLinks);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="GitHub Profile URL"
                  value={group.socialLinks?.[1] || ""}
                  onChange={(e) => {
                    const newLinks = [...(group.socialLinks || [])];
                    newLinks[1] = e.target.value;
                    handleInputChange("socialLinks", newLinks);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Portfolio Website"
                  value={group.socialLinks?.[2] || ""}
                  onChange={(e) => {
                    const newLinks = [...(group.socialLinks || [])];
                    newLinks[2] = e.target.value;
                    handleInputChange("socialLinks", newLinks);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

// Main form component
const GroupForm = () => {
  const userProfile = useSelector((state) => state.userProfile.data);
  const theme = useTheme();
  const username = userProfile?.fetchedUsed?.userName;
  const userId = userProfile?.fetchedUsed?.userId;
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const isEdit = searchParams.get("edit") === "true";
  const navigate = useNavigate();
  const [group, setGroup] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    dob: "",
    gender: "",
    designation: "",
    socialLinks: [],
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    sections: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing group data if editing
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/getSingleCv/${username}/${groupId}`
        );
        const cvData = response.data.singleCv;

        if (cvData) {
          const updatedSections = cvData.sections.map((section) => {
            if (section.name.toLowerCase() === "summary") {
              const data = Array.isArray(section.data)
                ? section.data[0] || ""
                : section.data || "";
              return { name: "Summary", data };
            }
            if (section.name.toLowerCase() === "achievement") {
              return {
                name: "Achievement",
                data: section.data.map((entry) => ({ title: entry })),
              };
            }
            if (section.name.toLowerCase() === "interest") {
              return {
                name: "Interest",
                data: section.data.map((entry) => ({ interest: entry })),
              };
            }
            // Add currentlyWorking field to experience entries
            if (section.name.toLowerCase() === "experience") {
              return {
                ...section,
                data: section.data.map((entry) => ({
                  ...entry,
                  currentlyWorking: entry.currentlyWorking || false,
                })),
              };
            }
            // Add currentlyStudying field to education entries
            if (section.name.toLowerCase() === "education") {
              return {
                ...section,
                data: section.data.map((entry) => ({
                  ...entry,
                  currentlyStudying: entry.currentlyStudying || false,
                })),
              };
            }
            return section;
          });

          setGroup({
            userId: userId,
            cvInfoId: cvData?.cvInfoId,
            firstName: cvData?.firstName || "",
            lastName: cvData?.lastName || "",
            email: cvData?.email || "",
            phoneNo: cvData?.phoneNo || "",
            dob: cvData?.dob || "",
            gender: cvData?.gender || "",
            designation: cvData?.designation || "",
            socialLinks:
              cvData?.socialLinks && Array.isArray(cvData.socialLinks)
                ? cvData.socialLinks
                : [],
            street: cvData?.address?.street || "",
            city: cvData?.address?.city || "",
            state: cvData?.address?.state || "",
            zip: cvData?.address?.pinCode || "",
            country: cvData?.address?.country || "",
            sections: updatedSections,
          });

          // Initially collapse all sections
          setExpandedSections(
            updatedSections.reduce(
              (acc, section) => ({ ...acc, [section.name]: false }),
              {}
            )
          );
        }
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };
    if (isEdit && groupId) {
      fetchGroup();
    }
  }, [isEdit, groupId, username, userId]);

  // Update personal info fields
  const handleInputChange = (field, value) => {
    setGroup((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Update section fields
  const handleSectionChange = (
    sectionName,
    sectionIndex,
    entryIndex,
    field,
    value
  ) => {
    setGroup((prev) => {
      const updatedSections = [...prev.sections];
      const targetSection = updatedSections[sectionIndex];
      if (!targetSection) return prev;

      if (sectionTypes[sectionName].single) {
        updatedSections[sectionIndex] = { ...targetSection, data: value };
      } else {
        const updatedData = targetSection.data.map((item, i) =>
          i === entryIndex
            ? { ...item, [field]: field === "rating" ? Number(value) : value }
            : item
        );
        updatedSections[sectionIndex] = { ...targetSection, data: updatedData };
      }
      return { ...prev, sections: updatedSections };
    });

    setErrors((prev) => ({
      ...prev,
      [`${sectionName}_${entryIndex}_${field}`]: "",
    }));
  };

  // Add a new section or entry
  const addSectionEntry = (sectionName) => {
    const fields = sectionTypes[sectionName].fields.reduce(
      (acc, field) => ({
        ...acc,
        [field]:
          field === "rating"
            ? 1
            : field === "technologies" || field === "projectImages"
              ? []
              : field === "currentlyWorking" || field === "currentlyStudying"
                ? false
                : "",
      }),
      {}
    );
    setGroup((prev) => {
      const existingSection = prev.sections.find((s) => s.name === sectionName);
      if (sectionTypes[sectionName].single) {
        return {
          ...prev,
          sections: [
            ...prev.sections.filter((s) => s.name !== sectionName),
            { name: sectionName, data: "" },
          ],
        };
      }
      return {
        ...prev,
        sections: existingSection
          ? prev.sections.map((s) =>
            s.name === sectionName ? { ...s, data: [...s.data, fields] } : s
          )
          : [...prev.sections, { name: sectionName, data: [fields] }],
      };
    });
    setExpandedSections((prev) => ({ ...prev, [sectionName]: true }));
  };

  // Remove a section
  const removeSection = (sectionName) => {
    setGroup((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.name !== sectionName),
    }));
    setExpandedSections((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[sectionName];
      return newExpanded;
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key.startsWith(sectionName)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  // Remove an entry
  const removeEntry = (sectionName, entryIndex) => {
    setGroup((prev) => {
      const updatedSections = [...prev.sections];
      const sectionIndex = updatedSections.findIndex(
        (s) => s.name === sectionName
      );
      if (sectionIndex !== -1 && !sectionTypes[sectionName].single) {
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          data: updatedSections[sectionIndex].data.filter(
            (_, i) => i !== entryIndex
          ),
        };
        if (updatedSections[sectionIndex].data.length === 0) {
          updatedSections.splice(sectionIndex, 1);
          setExpandedSections((prev) => {
            const newExpanded = { ...prev };
            delete newExpanded[sectionName];
            return newExpanded;
          });
        }
      }
      return { ...prev, sections: updatedSections };
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key.startsWith(`${sectionName}_${entryIndex}`))
          delete newErrors[key];
      });
      return newErrors;
    });
  };

  // Toggle section collapse
  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Move section for drag-and-drop
  const moveSection = (fromIndex, toIndex) => {
    setGroup((prev) => {
      const reorderedSections = [...prev.sections];
      const [moved] = reorderedSections.splice(fromIndex, 1);
      reorderedSections.splice(toIndex, 0, moved);
      return { ...prev, sections: reorderedSections };
    });
  };

  // Validate form
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate personal information
    if (!group.firstName?.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    if (!group.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }
    if (!group.designation?.trim()) {
      newErrors.designation = "Designation is required";
      isValid = false;
    }
    if (!group.email?.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(group.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!group.phoneNo?.toString()?.trim()) {
      newErrors.phoneNo = "Phone number is required";
      isValid = false;
    }
    if (!group.city?.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }
    if (!group.state?.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }
    if (!group.zip?.toString()?.trim()) {
      newErrors.zip = "ZIP code is required";
      isValid = false;
    }
    if (!group.country?.trim()) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    // Check if there are any sections
    if (group.sections.length === 0) {
      setSubmitError(
        "Please add at least one section to your CV before saving."
      );
      isValid = false;
    }

    group.sections.forEach((section, sectionIndex) => {
      const sectionConfig = sectionTypes[section.name];

      if (sectionConfig.single) {
        sectionConfig.required.forEach((field) => {
          const value = section.data;
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors[`${section.name}_0_${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)
              } is required`;
            isValid = false;
          }
        });
      } else {
        const data = section.data || [];
        if (data.length === 0) {
          newErrors[
            section.name
          ] = `Please add at least one entry to ${sectionConfig.title}`;
          isValid = false;
        }

        data.forEach((entry, entryIndex) => {
          sectionConfig.required.forEach((field) => {
            const fieldValue = entry[field];
            if (
              !fieldValue ||
              (Array.isArray(fieldValue) && fieldValue.length === 0) ||
              (typeof fieldValue === "string" && !fieldValue.trim()) ||
              (typeof fieldValue === "number" && isNaN(fieldValue))
            ) {
              newErrors[`${section.name}_${entryIndex}_${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)
                } is required`;
              isValid = false;
            }
          });
        });
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Submit form to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const formattedSections = group.sections.map((section) => {
      if (section.name === "Summary") {
        return { name: section.name, data: section.data };
      }
      if (section.name === "Achievement") {
        return {
          name: section.name,
          data: section.data.map((entry) => entry.title),
        };
      }
      if (section.name === "Interest") {
        return {
          name: section.name,
          data: section.data.map((entry) => entry.interest),
        };
      }
      return section;
    });

    try {
      if (isEdit && groupId) {
        const payloadCvupdate = {
          userName: username,
          userId: userId,
          cvInfoId: groupId,
          updateCvInfoSet: {
            firstName: group.firstName,
            lastName: group.lastName,
            email: group.email,
            phoneNo: group.phoneNo,
            dob: group.dob,
            gender: group.gender,
            designation: group.designation,
            socialLinks: group.socialLinks,
            address: {
              street: group.street,
              city: group.city,
              state: group.state,
              pinCode: Number(group.zip),
              country: group.country,
            },
            sections: formattedSections,
          },
        };

        await axios.put(`${apiUrl}/updateCvInfoSet`, payloadCvupdate);
        navigate("/edit/template");
        // navigate("/edit");
      } else {
        const payloadCreateCv = {
          userId: userId,
          userName: username,
          cvInfo: [
            {
              firstName: group.firstName,
              lastName: group.lastName,
              email: group.email,
              phoneNo: Number(group.phoneNo),
              dob: Date(group.dob),
              gender: group.gender,
              profilePhoto: group.profilePhoto || "",
              designation: group.designation,
              socialLinks: group.socialLinks,
              address: {
                city: group.city,
                pinCode: Number(group.zip),
                state: group.state,
                country: group.country,
              },
              sections: formattedSections,
            },
          ],
        };

        try {
          const response = await axios.post(
            `${apiUrl}/create-cv`,
            payloadCreateCv
          );

          navigate("/edit");
        } catch (error) {
          setSubmitError(
            "Failed to save your CV. Please check all required fields and try again."
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel form
  const handleCancel = () => {
    navigate("/edit");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container maxWidth="md" sx={{ py: 1.5, backgroundColor: "transparent" }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 2,
            borderRadius: 1.5,
            mb: 2,
            background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {isEdit ? "Update Your CV" : "Create Your CV"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ opacity: 0.9, fontSize: "0.85rem" }}
          >
            Build a professional CV that stands out to employers
          </Typography>
        </Box>

        {/* Error Alert */}
        {submitError && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 1 }}
            onClose={() => setSubmitError("")}
          >
            {submitError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ backgroundColor: "transparent" }}
        >
          {/* Personal Information Section */}
          <PersonalInformationSection
            group={group}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          {/* CV Sections */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="text.primary"
                sx={{ fontSize: "1.1rem" }}
              >
                Your CV Sections
              </Typography>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                }}
                onClick={() => setShowModal(true)}
              >
                Add Section
              </Button>
            </Box>

            {(group.sections || []).length === 0 ? (
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  backgroundColor: "#fefefe",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: "0.9rem" }}
                >
                  No sections added yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5, fontSize: "0.8rem" }}
                >
                  Start by adding your education, experience, skills, or other
                  sections to build your CV.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowModal(true)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 1,
                    px: 2,
                    fontSize: "0.8rem",
                    py: 0.5,
                  }}
                >
                  Add Your First Section
                </Button>
              </Paper>
            ) : (
              <Box>
                {(group.sections || []).map((section, index) => (
                  <DraggableSection
                    key={section.name}
                    section={section}
                    index={index}
                    moveSection={moveSection}
                    toggleSection={toggleSection}
                    expandedSections={expandedSections}
                    handleSectionChange={handleSectionChange}
                    removeSection={removeSection}
                    removeEntry={removeEntry}
                    addSectionEntry={addSectionEntry}
                    errors={errors}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Modal for Adding Sections */}
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            PaperProps={{
              sx: { borderRadius: 1.5, maxWidth: 500, },
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: "primary.main",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                textAlign: "center",

                p: 1.5,
              }}
            >
              Add Section to CV
            </DialogTitle>
            <DialogContent sx={{ p: 1.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5, fontSize: "0.8rem", textAlign: "center" }}

              >
                Choose a section to add to your CV
              </Typography>
              <Grid container spacing={0.75} sx={{ display: "flex", flexDirection: "column" }}>
                {Object.keys(sectionTypes).map((section) => (
                  <Grid item xs={12} key={section}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={
                        <Avatar
                          sx={{
                            bgcolor: "primary.light",
                            width: 24,
                            height: 24,
                            fontSize: "0.7rem",
                          }}
                        >
                          {sectionTypes[section].icon}
                        </Avatar>
                      }
                      sx={{
                        textTransform: "none",
                        justifyContent: "flex-start",
                        p: 1,
                        borderRadius: 1,
                        height: "auto",
                        mb: 0.5,
                        fontSize: "0.8rem",
                      }}
                      onClick={() => {
                        addSectionEntry(section);
                        setShowModal(false);
                      }}
                      disabled={group.sections.some((s) => {
                        const sName = s?.name?.toString()?.toLowerCase() || "";
                        const sectionName =
                          section?.toString()?.toLowerCase() || "";
                        return sName === sectionName;
                      })}
                    >
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body2" fontWeight={600}>
                          {sectionTypes[section].title}
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 1 }}>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 1,
                  fontSize: "0.8rem",
                  px: 2,
                  py: 0.5,
                }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* Form Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              variant="outlined"
              bgcolor="red"
              sx={{
                textTransform: "none",
                fontSize: "0.85rem",
                borderRadius: 1,
                px: 2,
                py: 0.5,
              }}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                textTransform: "none",
                fontSize: "0.85rem",
                borderRadius: 1,
                px: 2,
                py: 0.5,
                bgcolor: "primary.main",
              }}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update CV" : "Create CV"}
            </Button>
          </Box>
        </Box>
      </Container>
    </DndProvider>
  );
};

export default GroupForm;
