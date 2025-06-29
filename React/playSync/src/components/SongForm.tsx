import {useForm,SubmitHandler}from "react-hook-form";
import{Button,TextField,Paper, Checkbox, FormControlLabel}from "@mui/material";
import { FC, useEffect } from "react";
import { SongFormData } from "../types/SongFormData";
type SongFormProps={
    defaultValues:SongFormData;
    onSubmit:SubmitHandler<SongFormData>;
}
export const SongForm:FC<SongFormProps> = ({defaultValues,onSubmit}) => {
    const {register,handleSubmit,reset} = useForm<SongFormData>({defaultValues})
     
    useEffect(()=>{
        reset(defaultValues);
    },[defaultValues,reset])

    return (
        <Paper elevation={3} className="p-6 max-w-xl mx-auto mt-6 shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TextField
                label="Title"
                fullWidth
                {...register("title",{required:"Title is required"})}
                />
                <TextField
                label="Artist"
                fullWidth
                {...register("artist",{required:"Artist is required"})}
                />
                <TextField
                label="Genre"
                fullWidth
                {...register("genre",{required:"Genre is required"})}
                />
                <TextField
                label="Audio URL"
                fullWidth
                {...register("cloudinaryUrl",{required:"Audio URL is required"})}
                />
                <TextField
                label="Backup URL"
                fullWidth
                {...register("backupUrl")}
                />
                <FormControlLabel
                    label="Favorite"
                    control={<Checkbox {...register("favorite")} />}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" fullWidth onClick={() => reset()}>
                    Cancel  
                </Button>
            </form>
        </Paper>
    );
};
