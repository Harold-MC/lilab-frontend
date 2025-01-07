import { FC } from "react";
import { Button, FormControl, FormHelperText, Grid2, Stack, TextField, Typography, Select, InputLabel, MenuItem } from "@mui/material"
import { useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type CustomerForm, schema, } from "./schema";
import ICustomer from "@/interfaces/models/ICustomer";

const CustomerForm: FC<{
    customer?: ICustomer,
    onCancel?: () => void,
    onSave: (payload: CustomerForm) => void,
    isLoading: boolean
}> = ({ customer, onCancel, onSave, isLoading }) => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        control
    } = useForm<CustomerForm>({
        // @ts-expect-error
        resolver: yupResolver(schema),
        defaultValues: {
            ...customer,
            status: (customer?.isActive || !customer) ? 1 : 0
        }
    });

    const {
        field: registerIsActive,
    } = useController({
        name: 'status',
        control,
    });


    return <Stack spacing={2}>
        <Typography color="info" variant="h5" fontWeight="bold">{customer ? 'Editar' : 'Crear'} Cliente</Typography>

        <Grid2 spacing={2} container>
            <Grid2 size={{ md: 6, xs: 12 }}>
                <FormControl fullWidth>
                    <TextField label="Nombres"  {...register('name')} />
                    {'name' in errors && <FormHelperText error>{errors.name?.message}</FormHelperText>}
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
                    {'status' in errors && <FormHelperText error>{errors.status?.message}</FormHelperText>}
                </FormControl>
            </Grid2>
            <Grid2 size={{ md: 6, xs: 12 }}>
                <FormControl fullWidth>
                    <TextField label="Email"  {...register('email')} disabled={!!customer} />
                    {'email' in errors && <FormHelperText error>{errors.email?.message}</FormHelperText>}
                </FormControl>
            </Grid2>
            <Grid2 size={{ md: 6, xs: 12 }}>
                <FormControl fullWidth>
                    <TextField label="Telefono"  {...register('phone')} />
                    {'phone' in errors && <FormHelperText error>{errors.phone?.message}</FormHelperText>}
                </FormControl>
            </Grid2>
        </Grid2>

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="outlined" color="info" onClick={onCancel}>Cancelar</Button>
            <Button variant="contained" disabled={isLoading} onClick={handleSubmit(onSave)}>Guardar Cambios</Button>
        </Stack>
    </Stack>
}

export default CustomerForm