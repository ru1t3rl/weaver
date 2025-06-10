import {Box, CssBaseline, CssVarsProvider} from '@mui/joy';
import styles from './App.module.scss';
import {theme} from './themes/theme';
import ThemeToggle from './themes/theme-toggle';
import {environment, useGetService} from "@weaver/shared";
import {QueryClient, QueryClientProvider} from "react-query";

function Test() {
    const {data: axiosResponse, isLoading} = useGetService({
        axios: {
            baseURL: environment.apiAddress,
        }
    });

    console.log(axiosResponse);
    
    return <>
        {isLoading && <div>Loading...</div>}
        {!isLoading && axiosResponse?.data.map(x => <div>{x.name}</div>)}
    </>
}

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <CssVarsProvider theme={theme}>
                <CssBaseline/>
                <Box className={styles['app-container']}>
                    <Test/>
                </Box>
                <ThemeToggle className={styles['theme-toggle']}/>
            </CssVarsProvider>
        </QueryClientProvider>
    );
}

export default App;
