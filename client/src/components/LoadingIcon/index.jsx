import { FallingLines } from 'react-loader-spinner';
import './index.css';

function LoadingIcon() {
    return (
        <div className="loading-icon-div">
            <FallingLines
                color="#FFCD00"
                width="100"
                visible={true}
                ariaLabel='falling-lines-loading'
            />
            <p>Loading...</p>
        </div>
    )
}

export default LoadingIcon