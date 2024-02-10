import React from 'react';
import ReactDOM from 'react-dom/client';
import './GridNode.css';

export default function GridNode({value, type, row, col, handleMouseUp, handleMouseOver, handleMouseDown}) {
    return (
        <div className={`node ${type}`} 
        id={value}
        onMouseDown={() => handleMouseDown(row, col)}
        onMouseOver={() => handleMouseOver(row, col)} 
        onMouseUp={() => handleMouseUp(row, col)}>
        </div>
    );
}