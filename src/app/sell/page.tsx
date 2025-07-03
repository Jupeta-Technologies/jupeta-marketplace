'use client'

import React, { useEffect, useState } from 'react';
import { Chip } from '@mui/joy';
import { IoToggleSharp, IoAddCircle } from "react-icons/io5";
import { PublishItems } from '@/lib/api/PublishItemsAPI';
import template from './template/productBase-template.json';
// ProductForm is not used in the provided snippet, but keeping the import
// import ProductForm from './template/productBase-render';

// Define an interface for your listData state
// Using Record<string, any> for Specification to allow diverse values
interface ListDataState {
  Title: string;
  Condition: string;
  Summary: string;
  Price: string;
  Description: string;
  Quantity: number;
  Specification: Record<string, any>; // More flexible type for specifications
  sellType: string;
  prevImg: string[];
}

// 1. Basic field types
interface BaseField {
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean; // Made optional as not all fields have it
  default?: string | number; // Added for fields like 'condition' and 'shipping cost'
}

interface TextField extends BaseField {
  type: "text" | "number" | "textarea"; // Broaden types for reusability
}

interface SelectField extends BaseField {
  type: "select";
  options: string[] | { label: string; value: string; subcategories?: SubcategoryOption[] }[];
}

interface FileField extends BaseField {
  type: "file";
  multiple?: boolean;
  accept?: string;
}

// Subcategory option structure
interface SubcategoryOption {
  label: string;
  value: string;
}

// Category option structure (with subcategories)
interface CategoryOption {
  label: string;
  value: string;
  subcategories: SubcategoryOption[];
}

// 2. Specific field types for 'product' section
interface ProductCategoryField extends SelectField {
  options: CategoryOption[];
}

interface ProductConditionField extends SelectField {
  options: string[]; // "New", "Used", "Refurbished"
}

// Type for a group of fields (like 'shipping')
interface GroupField extends BaseField {
  type: "group";
  fields: {
    [key: string]: TextField | SelectField; // Can contain different field types
  };
}

// 3. Product section structure
interface ProductTemplate {
  category: ProductCategoryField;
  condition: ProductConditionField;
  shipping: GroupField;
  // Add other product-level fields if they exist, e.g.,
  // [key: string]: TemplateField | GroupField; // If product section can have other dynamic fields
}

// 4. Specification field types (reusing BaseField types)
type SpecificationField = TextField | SelectField | FileField; // If you add file inputs to specs

// 5. Structure for individual subcategory specifications (e.g., mobile_phones)
interface SubcategorySpecifications {
  [fieldKey: string]: SpecificationField; // e.g., 'brand', 'model', 'storage'
}

// 6. Structure for categories within specifications (e.g., electronics)
interface CategorySpecifications {
  [subcategoryKey: string]: SubcategorySpecifications; // e.g., 'mobile_phones', 'computers_tablets'
}

// 7. Full Template structure
interface AppTemplate {
  product: ProductTemplate;
  specifications: {
    [categoryKey: string]: CategorySpecifications; // e.g., 'electronics', 'fashion', 'home_garden'
  };
}


const SellListing = () => {
    const typedTemplate: AppTemplate = template as AppTemplate; // If direct import isn't strongly typed

    // defaultImg will store the URL string for display
    const [defaultImg, setdefaultImg] = useState<string>("");
    // imgF will store the actual File object to be sent with FormData
    const [imgF, setimgF] = useState<File | null>(null); // State to hold the selected File object

    const [matchedItem, setmatchedItem] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [specifications, setSpecifications] = useState<Record<string, any>>({}); // Ensure this is also flexible

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
        setSubcategory(""); // Reset subcategory when category changes
        setSpecifications({}); // Reset specifications when category changes
    };

    const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubcategory(e.target.value);
        setSpecifications({}); // Reset specifications when subcategory changes
    };

    // Corrected type for value: it can be string, FileList, or null
    const handleSpecificationChange = (label: string, value: string | FileList | null) => {
        setSpecifications((prevSpecifications) => ({
            ...prevSpecifications,
            [label]: value, // Update the specification value for the given label
        }));
        // console.log(specifications); // This might log the old state due to closure
    };

    const renderField = (field: any, key: any) => {
        // Using 'any' for field for now, but ideally define a more specific interface for field structure
        switch (field.type) {
            case "text":
                return (
                    <div key={key}>
                        <label>{field.label}</label>
                        <input
                            type="text"
                            placeholder={field.placeholder}
                            required={field.required}
                            value={specifications[field.label] || ""}
                            onChange={(e) =>
                                handleSpecificationChange(field.label, e.target.value)
                            }
                        />
                    </div>
                );
            case "select":
                return (
                    <div key={key}>
                        <label>{field.label}</label>
                        <select
                            required={field.required}
                            value={specifications[field.label] || ""}
                            onChange={(e) =>
                                handleSpecificationChange(field.label, e.target.value)
                            }
                        >
                            <option value="">Select an option</option>
                            {field.options.map((option: any, index: React.Key | null | undefined) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            case "textarea":
                return (
                    <div key={key}>
                        <label>{field.label}</label>
                        <textarea
                            placeholder={field.placeholder}
                            required={field.required}
                            value={specifications[field.label] || ""}
                            onChange={(e) =>
                                handleSpecificationChange(field.label, e.target.value)
                            }
                        />
                    </div>
                );
            case "file":
                return (
                    <div key={key}>
                        <label>{field.label}</label>
                        <input
                            type="file"
                            multiple={field.multiple}
                            accept={field.accept}
                            required={field.required}
                            onChange={(e) =>
                                // Pass the FileList directly to handleSpecificationChange
                                handleSpecificationChange(field.label, e.target.files)
                            }
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    // Initialize listData with the correct type
    const [listData, setlistData] = useState<ListDataState>({
        Title: '',
        Condition: '',
        Summary: 'This is a short test',
        Price: '',
        Description: "",
        Quantity: 1,
        Specification: {}, // Ensure this matches the interface
        sellType: '',
        prevImg: []
    });

    // Event handler for generic input changes on listData
    const handelDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // Type assertion for event target name and value to ensure they are strings
        setlistData({ ...listData, [e.target.name as string]: e.target.value });
    };

    const setImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const imgsrc = URL.createObjectURL(selectedFile);

            // Set imgF to the actual File object
            setimgF(selectedFile);
            // Set defaultImg to the URL for immediate preview
            setdefaultImg(imgsrc);

            // Update prevImg in listData state by creating a new array
            setlistData(prevlistData => ({
                ...prevlistData,
                prevImg: [...prevlistData.prevImg, imgsrc] // Add the new image URL to the array
            }));

            console.log("Selected file URL:", imgsrc);
        } else {
            console.log("No file selected.");
            // Optionally clear image states if no file is selected
            // setimgF(null);
            // setdefaultImg("");
        }
    };

    const handlePublish = () => {
        const dataToSend = {
            ProductName: listData.Title,
            Description: listData.Description,
            Summary: listData.Summary,
            Price: listData.Price,
            IsAvailable: true, // Assuming this is always true for published items
            Quantity: listData.Quantity,
            Category: 3, // Hardcoded, consider mapping this from category state
            SellingType: 1, // Hardcoded, consider mapping from sellType state
            Condition: 1, // Hardcoded, consider mapping from Condition state
            Specification: JSON.stringify(listData.Specification) // Convert specifications object to JSON string
        };

        const fd = new FormData();

        // Iterate over dataToSend using for...of loop for Object.entries
        for (const [key, value] of Object.entries(dataToSend)) {
            console.log(`Appending ${key}:`, value);
            // Append all non-file data as strings
            fd.append(key, String(value)); // Ensure value is converted to string for FormData
        }

        // Append the main image file if it exists
        if (imgF) {
            fd.append("ImageFile", imgF, imgF.name); // Correctly append the File object with its name
        }

        // --- Debugging FormData contents ---
        console.log("FormData Contents:");
        for (const pair of fd.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }
        // --- End Debugging ---

        // Call your API to publish items
        PublishItems(fd);
    };

    // Effect to update listData.Specification when specifications state changes
    useEffect(() => {
        setlistData((prevListData) => ({
            ...prevListData,
            Specification: specifications,
        }));

        console.log("Current Specifications:", specifications);
        console.log("Current ListData:", listData); // This might show old listData due to closure
    }, [specifications]); // Only run when specifications changes

    return (
        <>
            <div className="container" style={{ marginTop: '100px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '48px' }}>Buy. Sell. Trade</h1>
                {/* Ensure your template.product rendering is correct based on your JSON structure */}
                <form>
                    {/* Render Category & Subcategory fields */}
                    {template && template.product && Object.entries(template.product).map(([key, field]: [string, any]) => {
                        if (key === "category") {
                            return (
                                <div key={key}>
                                    <label>{field.label}</label>
                                    <select onChange={handleCategoryChange} required={field.required} value={category}>
                                        <option value="">Select a category</option>
                                        {field.options.map((option: { value: string; label: string; }, index: React.Key | null | undefined) => (
                                            <option key={index} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {category && (
                                        <div>
                                            <label>Subcategory</label>
                                            <select
                                                onChange={handleSubcategoryChange}
                                                required={field.required}
                                                value={subcategory}
                                            >
                                                <option value="">Select a subcategory</option>
                                                {field.options
                                                    .find((opt: { value: string; }) => opt.value === category)
                                                    ?.subcategories.map((sub: { value: string; label: string; }, index: React.Key | null | undefined) => (
                                                        <option key={index} value={sub.value}>
                                                            {sub.label}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        // Render other fields from template.product if any
                        // Assuming renderField can handle fields outside of category/subcategory as well
                        return renderField(field, key);
                    })}
                </form>


                <input type="text" placeholder='What do you want sell or trade?' value={matchedItem} style={{ width: '90%', height: '48px', fontSize: '1.5rem', fontWeight: '400', padding: '8px 16px', margin: '0 auto', boxShadow: 'var(--primaryShadow)', borderRadius: '24px' }} onChange={(e) => { setmatchedItem(e.target.value) }} />
                <div style={{ margin: '24px auto' }}><span>No match found</span><button style={{ background: '#2E6F94', color: '#FFF', width: '100px', padding: '8px', borderRadius: '24px', marginLeft: '24px' }} value={matchedItem} name='Title' onClick={() => { handelDataChange; console.log(listData.Title) }}>Continue</button></div>
                <div style={{ display: 'block' }}>
                    <section>
                        <h5>Listing Details</h5>
                        <div className="listDetail">
                            <h6>Title</h6>
                            <p style={{ fontWeight: 400, fontSize: '16px', width: '100%' }}>
                                <input type='text' value={listData.Title} name='Title' placeholder='Enter name of item' onChange={(e) => { handelDataChange(e) }} style={{ width: '100%', backgroundColor: 'transparent' }} />
                            </p>

                            <div className="ConTyQty">
                                <div className="Con">
                                    <h6>Condition</h6>
                                    {/* Using select for Condition with actual value, consider mapping to an ID for API */}
                                    <select name="Condition" value={listData.Condition} onChange={(e) => { handelDataChange(e) }}>
                                        <option value="">Select Condition</option> {/* Added a default empty option */}
                                        <option value="New">New</option>
                                        <option value="Used">Used</option>
                                        <option value="Refurbished">Refurbished</option>
                                        <option value="For parts">For parts</option>
                                        <option value="Open box">Open box</option>
                                    </select>
                                </div>
                                <div className="Ty">
                                    <h6>Listing Type</h6>
                                    <input type="radio" name="sellType" value="Buy now" checked={listData.sellType === "Buy now"} onChange={handelDataChange} /> <span>Buy now </span>
                                    <input type='radio' name='sellType' value="Auction" checked={listData.sellType === "Auction"} onChange={handelDataChange} /> <span>Auction </span>
                                </div>
                                <div className="Qty">
                                    <h6>Quantity</h6>
                                    {/* Make this an input for user to change, or keep as fixed '1' if design choice */}
                                    <input type="number" name="Quantity" value={listData.Quantity} onChange={(e) => { handelDataChange(e as React.ChangeEvent<HTMLInputElement>) }} min="1" style={{ width: '60px' }} />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h5>Specifications</h5>
                        <div className="listSpecs">
                            {/* Render specification fields based on selected category and subcategory */}
                                {
                                category && subcategory &&
                                typedTemplate.specifications &&
                                typedTemplate.specifications[category as keyof typeof typedTemplate.specifications] &&
                                typedTemplate.specifications[category as keyof typeof typedTemplate.specifications][subcategory as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]] &&
                                    Object.entries(
                                        typedTemplate.specifications[
                                            category as keyof typeof typedTemplate.specifications
                                        ][
                                            subcategory as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
                                        ]
                                    ).map(([key, field]) => renderField(field, key))
                                }
                        </div>
                    </section>
                    <section>
                        <h5>Description</h5>
                        <div className="listDesc">
                            <textarea name='Description' value={listData.Description} placeholder='Please enter a good description of your item, to help it sell better' onChange={(e) => { handelDataChange(e as React.ChangeEvent<HTMLTextAreaElement>); }} style={{ borderRadius: '10px' }} />
                        </div>
                    </section>

                    <section>
                        <h5>Pricing</h5>
                        <div className="listPrice">
                            <div className="setPrice">
                                <p>Recommended</p>
                                <p>Enter a competitive price to sell faster</p>
                                <label htmlFor="Price"><h5>Price</h5></label>
                                {/* Changed onInput to onChange for consistency and React best practices */}
                                <input type="text" value={listData.Price} name='Price' onChange={(e) => { handelDataChange(e); }} style={{ marginLeft: '8px', fontSize: '20px', color: '#2E6F94' }} />

                                <p>Accepting Offer</p>
                            </div>
                            <div className='setSmartPrice'>
                                <p>Smart Pricing <span><IoToggleSharp style={{ color: 'green', fontSize: '1.5rem' }} /></span></p>
                                <p style={{ width: '350px', fontSize: 'small' }}>Smart Pricing automatically drops the price of your listing by 10% at the best time every week until it hits your floor price.</p>
                                <p>Floor Price <span style={{ color: 'green', fontSize: '1.5rem' }}>GHc 999.99</span></p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h5>Photos</h5>
                        <div className="listPhotos">
                            <ol className="lphotogrid">
                                {/* Display the defaultImg (main image) */}
                                <li className="pmain">{defaultImg && <img src={defaultImg} alt="main" />}</li>
                                {/* Display other previously selected images */}
                                {listData.prevImg.map((src, index) => {
                                    // Ensure not to duplicate the defaultImg if it's already the first one displayed
                                    // This check makes sure `src` isn't the same as `defaultImg` if `defaultImg` is also in `prevImg`
                                    if (src === defaultImg && index === listData.prevImg.indexOf(defaultImg)) {
                                        return null; // Skip if it's the main image already displayed
                                    }
                                    return (<li key={index}><img src={src} alt={`preview ${index}`} /></li>);
                                })}
                                {/* Placeholders for other images, if you have a fixed number of slots */}
                                <li className="pone"></li>
                                <li className="ptwo"></li>
                                {/* Input for adding new photos */}
                                <li className="padd">
                                    <input
                                        type="file"
                                        accept='image/*'
                                        name="addIMG"
                                        style={{ opacity: 0, position: 'absolute', cursor: 'pointer', width: '48', height: '48' }}
                                        onChange={(e) => { setImg(e) }}
                                    />
                                    <IoAddCircle style={{ fontSize: '3rem', cursor: 'pointer' }} />
                                </li>
                            </ol>
                        </div>
                    </section>

                    <button type="button" onClick={handlePublish}>Publish</button> {/* Changed to type="button" to prevent form submission */}
                </div>
            </div>
        </>
    );
};

export default SellListing;