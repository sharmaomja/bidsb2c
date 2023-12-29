import React, { useState, useEffect } from 'react';

const Filters = ({ onSearch, searchTerm, onApplyFilters, isInLiveAuction, setIsInLiveAuction, showLiveAuctionFilter, handleApplyFilters }) => {
    // ... existing states and functions
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    
    const apiBaseURL = process.env.REACT_APP_API_URL;
    console.log(apiBaseURL);

   useEffect(() => {
        // Fetch categories
        fetch(`${apiBaseURL}/api/product-categories`)
            .then(response => response.json())
            .then(data => setCategories(data.map(category => ({ ...category, name: category.name.toLowerCase() }))));

        // Fetch attributes
        fetch(`${apiBaseURL}/api/product-attributes`)
            .then(response => response.json())
            .then(data => {
                const groupedAttributes = data.reduce((acc, attr) => {
                    const lowerName = attr.name.toLowerCase();
                    acc[lowerName] = acc[lowerName] ? [...new Set([...acc[lowerName], attr.value.toLowerCase()])] : [attr.value.toLowerCase()];
                    return acc;
                }, {});
                setAttributes(groupedAttributes);
            });
    }, []);

    const handleFilterChange = (name, value) => {
        if (value !== "") {
            setSelectedFilters({ ...selectedFilters, [name]: value });
        } else {
            // Remove the filter if the default option is selected
            const newFilters = { ...selectedFilters };
            delete newFilters[name];
            setSelectedFilters(newFilters);
        }
    };

    //const handleInputChange = (e) => {
    //    onSearch(e.target.value);
    //};


    // const applyFilters = () => {
    //     // Merge searchTerm and selectedFilters. If searchTerm is already a key in selectedFilters, it will be overwritten.
    //     const filtersToApply = { ...selectedFilters, searchQuery: searchTerm };
    //     onApplyFilters(filtersToApply);
    // };

    const applyFilters = () => {
        const filtersToApply = {
            ...selectedFilters,
            isInLiveAuction: isInLiveAuction ? 'true' : ''
        };

        if (searchTerm && searchTerm.trim() !== '') {
            filtersToApply.search = searchTerm.trim();
        }

        onApplyFilters(filtersToApply);
    };

    const handleLiveAuctionChange = (e) => {
        setIsInLiveAuction(e.target.checked);
        // Apply filters immediately when checkbox state changes
        handleApplyFilters({ ...selectedFilters, isInLiveAuction: e.target.checked.toString() });
    };
    
    return (
        <aside className="p-4 w-64 mt-2">
            <h3 className="text-2xl font-semibold mb-4">Filters</h3>
            {showLiveAuctionFilter && (
            <div className="mb-4 font-semibold">
                <label className="block mb-2">Live Auctions</label>
                <input
                type="checkbox"
                checked={isInLiveAuction}
                onChange={handleLiveAuctionChange}
                className="mr-2"
                />
                Only Live Auctions
            </div>
            )}
            <div className="mb-2 w-full">
                <select
                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                    className="p-2 w-full border rounded font-bold"
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                    ))}
                </select>
            </div>
            {Object.keys(attributes).map(attr => (
                <div key={attr} className="mb-4 font-semibold">
                    <label className="block mb-2">{attr}</label>
                    <select
                        onChange={(e) => handleFilterChange(attr, e.target.value)}
                        className="p-2 w-full border rounded"
                    >
                        <option value="">{`Select ${attr}`}</option>
                        {attributes[attr].map(value => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
            ))}
            <button onClick={applyFilters} className="bg-green-600 text-white p-2 rounded hover:bg-blue-700 w-full">
                Apply Filters
            </button>
        </aside>
    );
};

export default Filters;
