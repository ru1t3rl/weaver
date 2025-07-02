import styles from './App.module.scss';
import {QueryClient, QueryClientProvider} from "react-query";
import {MainGraph} from "@weaver/graph";
import {ThemeProvider, ThemeToggle} from "@weaver/styling";

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <div className={styles['app-container']}>
                    <MainGraph/>
                </div>
                <ThemeToggle className={styles['theme-toggle']}/>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
