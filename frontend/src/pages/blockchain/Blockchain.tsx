import React, { useEffect, useState } from 'react';
import Nav from '../nav/Nav'; // Adjust the import path
import Footer from '../nav/Footer';
import backgroundImage from '../../assets/spectral-light-illuminates-transparent-red-colored-red-roses-abstract-flower-art-generative-ai.jpg';

interface Block {
    ID: number;
    NEXT_block_id: string | null;
    Num_img: number;
    PREV_block_id: string | null;
    images: string[];
    nonce: number;
    timestamp: number;
    user_custom_name: string;
    username: string;
}

interface BlockchainData {
    chain: Block[];
    length: number;
}

function Blockchain() {
    const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(null);
    const [hoveredBlockId, setHoveredBlockId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        fetch('http://127.0.0.1:8080/chain')
            .then(response => response.json())
            .then(data => setBlockchainData(data))
            .catch(error => console.error('Error fetching blockchain data:', error));
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Mock Genesis Block (in case it's missing or filtered out)
    const genesisBlock: Block = {
        ID: 1,
        NEXT_block_id: blockchainData?.chain[0]?.ID.toString() || null,
        Num_img: 0,
        PREV_block_id: null,
        images: [],
        nonce: 0,
        timestamp: Date.now() / 1000, // Use current timestamp for mock
        user_custom_name: "Genesis Block",
        username: "system"
    };

    // Ensure Genesis block is always present and unfiltered
    let displayedBlocks = blockchainData?.chain.filter(block =>
        block.images.some(image => image.includes(searchQuery))
    ) || [];

    // Check if the Genesis block exists and prepend it
    const isGenesisPresent = blockchainData?.chain.some(block => block.PREV_block_id === null);
    if (!isGenesisPresent) {
        displayedBlocks = [genesisBlock, ...displayedBlocks];
    }

    if (!blockchainData) {
        return (
            <div className="flex justify-center items-center h-screen bg-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                    <p className="mt-4 text-lg font-semibold text-blue-700">Loading Blockchain Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                <Nav />
                <main className="p-28 flex flex-col items-center justify-center flex-1 px-4 fade-in">
                    <div className="flex justify-center mb-8">
                        <input
                            type="text"
                            placeholder="Search image hash..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border border-blue-300 rounded-lg p-2 w-72"
                        />
                    </div>
                    <div className="flex justify-center items-center space-x-4">
                        {displayedBlocks.map((block, index) => (
                            <div key={block.ID} className="flex items-center relative">
                                {/* Horizontal Chain link (line between blocks) */}
                                {index > 0 && (
                                    <div className="w-8 h-1 bg-neutral-600 mx-4"></div> // Horizontal line between blocks
                                )}

                                {/* Block */}
                                <div
                                    className={`border ${
                                        block.PREV_block_id === null ? 'bg-cyan-400' : 'bg-cyan-200'
                                    } border-blue-200 rounded-lg shadow-md p-6 hover:bg-orange-100 transition-transform transform hover:scale-105 duration-300`}
                                    onMouseEnter={() => setHoveredBlockId(block.ID)}
                                    onMouseLeave={() => setHoveredBlockId(null)}
                                    style={{ 
                                        minWidth: '200px', 
                                        maxWidth: '375px', 
                                        minHeight: '500px', 
                                        maxHeight: '505px' 
                                    }}
                                >
                                    <h2 className="text-xl font-bold text-blue-600 mb-2">
                                        Block ID: {block.ID} {block.PREV_block_id === null && '(Genesis Block)'}
                                    </h2>

                                    {/* Next Block ID with overflow hidden until hover */}
                                    <div className="relative">
                                        <p className="text-blue-700 overflow-hidden">
                                            <strong className="text-black">Next Block ID:</strong>
                                            <span className="overflow-hidden text-ellipsis whitespace-nowrap block hover:whitespace-normal hover:bg-white hover:shadow-lg hover:rounded-md hover:absolute hover:z-50 hover:max-w-max p-2">
                                                {block.NEXT_block_id || 'None'}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Number of Images */}
                                    <p className="text-blue-700">
                                        <strong className="text-black">Number of Images:</strong> {block.Num_img}
                                    </p>

                                    {/* Previous Block ID with overflow hidden until hover */}
                                    <div className="relative">
                                        <p className="text-blue-700 overflow-hidden">
                                            <strong className="text-black">Previous Block ID:</strong>
                                            <span className="overflow-hidden text-ellipsis whitespace-nowrap block hover:whitespace-normal hover:bg-white hover:shadow-lg hover:rounded-md hover:absolute hover:z-50 hover:max-w-max p-2">
                                                {block.PREV_block_id || 'None'}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Additional Block Data */}
                                    <p className="text-blue-700">
                                        <strong className="text-black">Nonce:</strong> {block.nonce}
                                    </p>
                                    <p className="text-blue-700">
                                        <strong className="text-black">Timestamp:</strong> {new Date(block.timestamp * 1000).toLocaleString()}
                                    </p>
                                    <p className="text-blue-700">
                                        <strong className="text-black">User Custom Name:</strong> {block.user_custom_name}
                                    </p>
                                    <p className="text-blue-700">
                                        <strong className="text-black">Username:</strong> {block.username}
                                    </p>

                                    {/* Images List */}
                                    {block.images.length > 0 && (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold text-black">Images</h3>
                                            <ul className="list-disc space-y-1 overflow-hidden text-sm text-blue-600 pl-5">
                                                {(hoveredBlockId === block.ID ? block.images : block.images.slice(0, 5)).map((image, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <span className="inline-block w-2 h-2 mr-2 bg-blue-600 rounded-full"></span>
                                                        {image}
                                                    </li>
                                                ))}
                                                {block.images.length > 5 && hoveredBlockId !== block.ID && (
                                                    <li>...and {block.images.length - 5} more</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                
                < Footer/>
                
            </div>
        </div>
    );
}

export default Blockchain;
