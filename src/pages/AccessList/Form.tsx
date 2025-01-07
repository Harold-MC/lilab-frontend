import { FC } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid2,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import IAccess from "@/interfaces/models/IAccess";
import { type AccessFormType, schema } from "./schema";

import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import ICustomer from "@/interfaces/models/ICustomer";

const AccessForm: FC<{
  access?: IAccess;
  onCancel?: () => void;
  onSave: (payload: AccessFormType) => void;
  isLoading: boolean;
  customers: ICustomer[]
}> = ({ onCancel, onSave, isLoading, customers }) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AccessFormType>({
    // @ts-expect-error
    resolver: yupResolver(schema),
    defaultValues: {
      type: 0,
      date: dayjs().toDate()
    }
  });

  const user = watch("customer");
  const date = watch("date");
  const type = watch("type");

  return (
    <Stack spacing={2}>
      <Typography color="info" variant="h5" fontWeight="bold">
        Registrar acceso
      </Typography>

      <Grid2 spacing={2} container>
        <Grid2 size={12}>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              options={customers}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Cliente" />
              )}
              value={user}
              onChange={(_, val) => setValue("customer", val!)}
            />
            {"customer" in errors && (
              <FormHelperText error>{errors.customer?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
            <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
              <DateTimePicker
                label="Fecha de Registro"
                value={dayjs(date)}
                onChange={(newValue) => setValue('date', newValue?.toDate()!)}
              />
            </DemoContainer>
        </Grid2>
        <Grid2 size={12}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Tipo de Registro
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(_, val) => setValue('type', +val)}
              value={type}
            >
              <FormControlLabel
                value={0}
                control={<Radio />}
                label="Entrada"
              />
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Salida"
              />
            </RadioGroup>
          </FormControl>
        </Grid2>
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

export default AccessForm;
