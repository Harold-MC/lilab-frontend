import {
  Button,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Grid2,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Divider,
} from "@mui/material";
import { Search, Edit } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";
import { IUser } from "@/interfaces/models";
import UserForm from "./Form";
import { omit } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useCreateUser,
  useRemoveUser,
  useUpdateUser,
  useUsers,
} from "@/network/user";
import useHasPermission from "@/hooks/useHasPermission";

const Users = () => {
  const [page, setPage] = useState<number>(1);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<boolean>(false);
  const [role] = useState<any>();

  const [searchText, setSearchText] = useState<string>();

  const [status, setStatus] = useState<number>();

  const [filters, setFilters] = useState<{
    isActive?: boolean;
    searchText?: string;
    roleId?: string;
  }>();

  const [selectedUser, setSelectedUser] = useState<IUser>();

  const usersRequest = useUsers(
    { page: page!, pageSize: 10, ...filters },
    { initialData: { data: { data: [] } } }
  );

  const hasPermission = useHasPermission()
  const createUserRequest = useCreateUser();
  const updateUserRequest = useUpdateUser();
  const removeUserRequest = useRemoveUser();
  const queryClient = useQueryClient();

  const userList = usersRequest.data?.data || [];

  const onEdit = (user: IUser) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const onRemove = (user: IUser) => {
    setSelectedUser(user);
    setShowRemoveConfirm(true);
  };

  const onClose = () => {
    setSelectedUser(undefined);
    setShowForm(false);
  };

  const onRemoveClose = () => {
    setSelectedUser(undefined);
    setShowRemoveConfirm(false);
  };

  const onSearch = () => {
    let isActive;
    if (status === 1) isActive = true;
    if (status === 0) isActive = false;

    setFilters({ searchText, isActive, roleId: role?.id });
  };

  const onSave = async (payload: UserForm) => {    
    const params = {
      ...omit(payload, ["status"]),
      id: selectedUser?.id,
      isActive: !!payload.status,
    } as unknown as IUser;

    if (selectedUser) await updateUserRequest.mutateAsync(params);
    else await createUserRequest.mutateAsync(params);

    queryClient.invalidateQueries({ queryKey: ["fetchUsers"] });
    toast.success("Usuario guardado exitosamente");
    onClose();
  };

  const onConfirmRemove = async () => {
    await removeUserRequest.mutateAsync(selectedUser!.id);

    onRemoveClose();
    queryClient.invalidateQueries({ queryKey: ["fetchUsers"] });
    toast.success("Usuario eliminado exitosamente");
    onRemoveClose();
  };

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ md: "row", xs: "column" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ md: "center", xs: "flex-start" }}
      >
        <Typography color="info" fontWeight="bold" variant="h4">
          Administracion de usuarios
        </Typography>
        {hasPermission("users.create") && (
          <Button onClick={() => setShowForm(true)} variant="contained">
            Crear nuevo usuario
          </Button>
        )}
      </Stack>

      <Grid2 spacing={1} container>
        <Grid2 size={{ xs: 13, md: 3 }}>
          <TextField
            label="Nombre"
            placeholder="Ingrese nombre de usuario"
            size="small"
            fullWidth
            value={searchText}
            onChange={(evt) => setSearchText(evt.target.value)}
          />
        </Grid2>
        <Grid2 size={{ xs: 13, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel size="small" id="status-select-label">
              Estatus
            </InputLabel>
            <Select
              size="small"
              labelId="status-select-label"
              id="status-select"
              label="Estatus"
              value={status}
              onChange={(evt) => setStatus(+evt.target.value)}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
              <MenuItem value={2}>Todos</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 13, md: 3 }}>
          <IconButton color="secondary" onClick={onSearch}>
            <Search />
          </IconButton>
        </Grid2>
      </Grid2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold", maxWidth: 100 }}>
                Rol
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estatus</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role.name}</TableCell>
                <TableCell>{user.isActive ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  {hasPermission("users.edit") && (
                    <IconButton onClick={() => onEdit(user)}>
                      <Edit />
                    </IconButton>
                  )}
                  {hasPermission("users.delete") && (
                    <IconButton onClick={() => onRemove(user)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {userList!.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No se encontraron resultados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {userList.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={usersRequest.data?.pageCount}
            color="primary"
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}

      <Dialog open={showForm} fullWidth maxWidth="sm" onClose={onClose}>
        <DialogContent>
          <UserForm
            user={selectedUser}
            onCancel={onClose}
            onSave={onSave}
            isLoading={createUserRequest.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showRemoveConfirm}
        fullWidth
        maxWidth="sm"
        onClose={onClose}
      >
        <DialogTitle>Confirmar Eliminacion</DialogTitle>
        <Divider />
        <DialogContent>
          <span>Esta seguro que desea eliminar este usuario?</span>
        </DialogContent>
        <DialogActions>
          <Button onClick={onRemoveClose}>No</Button>
          <Button disabled={createUserRequest.isPending} onClick={onConfirmRemove}>Si</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Users;
