import React from 'react';

const RenderMovies = (props) => {
    return(
        <div>
            {props.renderMovies()}
        </div>
    )
}

export default RenderMovies;