import {
    Box,
    Container,
    Card,
    CardContent,
} from '@mui/material';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
    return (
        <Box sx={{ background: 'linear-gradient(90deg, rgba(73,73,180,1) 0%, rgba(0,212,255,1) 100%)' }}>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    <CardContent>
                        <Outlet />
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default PublicLayout;
