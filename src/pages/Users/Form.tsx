import { FC } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid2,
  Stack,
  TextField,
  Typography,
  Select,
  InputLabel,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IUser } from "@/interfaces/models";
import { schema, updateSchema, type UserForm } from "./schema";
import { roles } from "@/utils/enums";
import { pick } from "lodash";

const UserForm: FC<{
  user?: IUser;
  onCancel?: () => void;
  onSave: (payload: UserForm) => void;
  isLoading: boolean;
}> = ({ user, onCancel, onSave, isLoading }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<UserForm>({
    // @ts-expect-error
    resolver: yupResolver(user ? updateSchema : schema),
    defaultValues: {
      status: user?.isActive || !user ? 1 : 0,
      ...pick(user, ["isActive", "email", "name", "role"]),
    },
  });

  const { field: registerIsActive } = useController({
    name: "status",
    control,
  });

  const role = watch("role");

  return (
    <Stack spacing={2}>
      <Typography color="info" variant="h5" fontWeight="bold">
        {user ? "Editar" : "Crear"} Usuario
      </Typography>

      <Grid2 spacing={2} container>
        <Grid2 size={{ md: 6, xs: 12 }}>
          <FormControl fullWidth>
            <TextField label="Nombres" {...register("name")} />
            {"name" in errors && (
              <FormHelperText error>{errors.name?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={{ md: 6, xs: 12 }}>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              options={roles}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Rol" />}
              value={role}
              onChange={(_, val) => setValue("role", val!)}
            />
            {"role" in errors && (
              <FormHelperText error>{errors.role?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={{ md: 6, xs: 12 }}>
          <FormControl fullWidth>
            <TextField label="Email" {...register("email")} disabled={!!user} />
            {"email" in errors && (
              <FormHelperText error>{errors.email?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={{ md: 6, xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Estatus</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              label="Estatus"
              {...registerIsActive}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
            {"status" in errors && (
              <FormHelperText error>{errors.status?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        {!user && (
          <Grid2 size={{ md: 12, xs: 12 }}>
            <FormControl fullWidth>
              <TextField
                type="password"
                label="Password"
                {...register("password")}
              />
            </FormControl>
          </Grid2>
        )}
      </Grid2>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="outlined" color="info" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleSubmit(onSave)}
        >
          Guardar Cambios
        </Button>
      </Stack>
    </Stack>
  );
};

export default UserForm;
