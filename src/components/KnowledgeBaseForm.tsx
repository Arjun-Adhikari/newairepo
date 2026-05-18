import {
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";

import MainCard from "components/MainCard";

import { useForm, Controller } from "react-hook-form";

import { useKnowledgeBase } from "hooks/useKnowledgeBase";

import { KnowledgeBaseFormData } from "types/knowledgeBase";

const TYPE_OPTIONS = [
  "faq",
  "policy",
  "membership",
  "billing",
  "event_rule",
  "article",
];

const CATEGORY_OPTIONS = [
  "authentication",
  "membership",
  "billing",
  "events",
  "support",
  "general",
];

export default function KnowledgeBaseForm() {
  const { loading, submitKnowledgeBase } = useKnowledgeBase();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<KnowledgeBaseFormData>({
    defaultValues: {
      type: "faq",
      visibility: "public",
      is_active: true,
      priority: 5,
    },
  });

  const onSubmit = async (data: KnowledgeBaseFormData) => {
    const success = await submitKnowledgeBase(data);

    if (success) {
      alert("Knowledge Base Saved");

      reset();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        py: 2,
      }}
    >
      <MainCard
        title="Knowledge Base"
        sx={{
          width: "100%",
          maxWidth: 900,
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField select fullWidth label="Type" {...register("type")}>
                  {TYPE_OPTIONS.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  {...register("category")}
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Title"
                  {...register("title", {
                    required: true,
                  })}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Question"
                  {...register("question")}
                />
              </Grid>

              <Grid size={12}>
                <TextField fullWidth label="Answer" {...register("answer")} />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={8}
                  label="Content"
                  {...register("content", {
                    required: true,
                  })}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Tags"
                  helperText="Comma separated"
                  {...register("tags")}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Keywords"
                  helperText="Comma separated"
                  {...register("keywords")}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Common User Phrases"
                  {...register("common_user_phrases")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Priority"
                  {...register("priority")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  select
                  fullWidth
                  label="Visibility"
                  {...register("visibility")}
                >
                  <MenuItem value="public">Public</MenuItem>

                  <MenuItem value="private">Private</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label="Active"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider />

            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Saving..." : "Save Knowledge Base"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </MainCard>
    </Box>
  );
}
