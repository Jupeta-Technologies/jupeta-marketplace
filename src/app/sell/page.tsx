"use client";

import React, { useEffect, useState } from "react";
import { IoToggleSharp, IoAddCircle } from "react-icons/io5";
import { PublishItems } from "@/lib/api/PublishItemsAPI";
import template from "./template/productBase-template.json"; // Make sure this path is correct

// --- UPDATED INTERFACES TO REFLECT NEW TEMPLATE STRUCTURE ---
interface ListDataState {
  Title: string;
  Condition: string;
  Summary: string;
  Price: string;
  Description: string;
  Quantity: number;
  Specification: Record<string, any>;
  sellType: string;
  prevImg: string[];
}

interface BaseField {
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  default?: string | number | boolean; // Added boolean for default
  unit?: string; // New: for numerical units
  unit_hint?: string; // New: for complex units like dimensions
}

interface TextField extends BaseField {
  type: "text" | "textarea";
}
interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
} // Added min/max/step
interface SelectField extends BaseField {
  type: "select";
  options: string[] | { label: string; value: string }[];
  multiple?: boolean;
} // Added multiple
interface FileField extends BaseField {
  type: "file";
  multiple?: boolean;
  accept?: string;
}
interface BooleanField extends BaseField {
  type: "boolean";
} // New: for boolean toggles

// Union type for all possible specification field types
type SpecificationField =
  | TextField
  | SelectField
  | FileField
  | NumberField
  | BooleanField;

interface SpecificationSection {
  label: string;
  fields: { [key: string]: SpecificationField };
}

// SubcategorySpecifications now holds an array of sections
interface SubcategorySpecifications {
  sections: SpecificationSection[];
}

interface CategorySpecifications {
  [subcategoryKey: string]: SubcategorySpecifications;
}
interface Subcategory {
  label: string;
  value: string;
  imageUrl?: string; // `?` makes it optional, as 'Shoes' doesn't have it
}

// 2. Define the shape of an object within the 'options' array (a CategoryOption)
interface CategoryOption {
  label: string;
  value: string;
  imageUrl?: string; // Optional
  subcategories: Subcategory[]; // This is an array of Subcategory objects
}
interface ProductCategoryField extends SelectField {
  //options: string[];
  options: CategoryOption[];
} //options: CategoryOption[]
interface ProductConditionField extends SelectField {
  options: string[];
}
interface GroupField extends BaseField {
  type: "group";
  fields: {
    [key: string]: TextField | SelectField | NumberField | BooleanField;
  };
} // Updated for new types
interface ProductTemplate {
  category: ProductCategoryField;
  condition: ProductConditionField;
  shipping: GroupField;
}

interface AppTemplate {
  product: ProductTemplate;
  specifications: { [categoryKey: string]: CategorySpecifications };
}
// --- END UPDATED INTERFACES ---

const SellListing = () => {
  const typedTemplate: AppTemplate = template as unknown as AppTemplate;

  const [defaultImg, setdefaultImg] = useState<string>("");
  const [imgF, setimgF] = useState<File | null>(null);

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [specifications, setSpecifications] = useState<Record<string, any>>({});
  const [tempSpecifications, setTempSpecifications] = useState<
    Record<string, any>
  >({});

  const [isMatched, setIsMatched] = useState<boolean | null>(null);
  const [showFullListingForm, setShowFullListingForm] = useState(false);
  const [showInitialSearch, setShowInitialSearch] = useState(true);

  const [showCustomSpecInput, setShowCustomSpecInput] = useState(false);
  const [customSpecLabel, setCustomSpecLabel] = useState("");
  const [customSpecValue, setCustomSpecValue] = useState("");

  const [selectInputValues, setSelectInputValues] = useState<
    Record<string, string>
  >({});
  const [filteredSelectOptions, setFilteredSelectOptions] = useState<
    Record<string, string[]>
  >({});
  const [activeSelectField, setActiveSelectField] = useState<string | null>(
    null
  );

  const [showSpecsModal, setShowSpecsModal] = useState(false);

  const [listData, setlistData] = useState<ListDataState>({
    Title: "",
    Condition: "",
    Summary: "",
    Price: "",
    Description: "",
    Quantity: 1,
    Specification: {},
    sellType: "",
    prevImg: [],
  });

  const checkForMatch = (title: string): boolean => {
    return title.trim().toLowerCase() === "hello";
  };

  const handelDataChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "Quantity" && typeof value === "string") {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        setlistData({ ...listData, [name]: numValue });
        return;
      }
    }
    setlistData({ ...listData, [name]: value });
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setlistData((prev) => ({
      ...prev,
      Title: value,
    }));
    setIsMatched(null);
    setShowFullListingForm(false);
  };

  const handleContinueClick = () => {
    const currentTitle = listData.Title;
    const matchFound = checkForMatch(currentTitle);

    setIsMatched(matchFound);
    setShowFullListingForm(!matchFound);
    setShowInitialSearch(false);
    console.log(`Input title: "${currentTitle}", Match found: ${matchFound}`);
  };

  const handleBackClick = () => {
    setShowInitialSearch(true);
    setShowFullListingForm(false);
    setIsMatched(null);
    setCategory("");
    setSubcategory("");
    setSpecifications({});
    setTempSpecifications({}); // Reset temp specs as well
    setShowCustomSpecInput(false);
    setCustomSpecLabel("");
    setCustomSpecValue("");
    setSelectInputValues({});
    setFilteredSelectOptions({});
    setActiveSelectField(null);
    setShowSpecsModal(false); // Close modal on back
  };

  const handleCategoryCardClick = (value: string) => {
    setCategory(value);
    setSubcategory("");
    setSpecifications({});
    setTempSpecifications({}); // Reset temp specs
    setShowCustomSpecInput(false);
    setCustomSpecLabel("");
    setCustomSpecValue("");
    setSelectInputValues({});
    setFilteredSelectOptions({});
    setActiveSelectField(null);
    setShowSpecsModal(false); // Close modal on category change
  };

  // --- MODIFIED handleSubcategoryCardClick to extract defaults from sections ---
  const handleSubcategoryCardClick = (value: string) => {
    setSubcategory(value);
    setSpecifications({}); // Clear previous specs
    setTempSpecifications({}); // Clear previous temp specs

    // Populate with default values from template, now iterating through sections
    if (
      category &&
      value &&
      typedTemplate.specifications?.[
        category as keyof typeof typedTemplate.specifications
      ]?.[
        value as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
      ]
    ) {
      const defaultSpecs: Record<string, any> = {};
      const subcategoryDefinition =
        typedTemplate.specifications[
          category as keyof typeof typedTemplate.specifications
        ][
          value as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
        ];

      if ("sections" in subcategoryDefinition) {
        // Check if sections exist
        subcategoryDefinition.sections.forEach((section) => {
          for (const fieldKey in section.fields) {
            const field = section.fields[fieldKey];
            if (field.default !== undefined) {
              defaultSpecs[field.label] = field.default;
            }
          }
        });
      }
      setSpecifications(defaultSpecs); // Set main specifications with defaults
    }

    setShowCustomSpecInput(false);
    setCustomSpecLabel("");
    setCustomSpecValue("");
    setSelectInputValues({});
    setFilteredSelectOptions({});
    setActiveSelectField(null);
    setShowSpecsModal(false);
  };

  // --- MODIFIED handleSpecificationChange to handle multiple select values ---
  const handleSpecificationChange = (
    label: string,
    value: string | string[] | FileList | boolean | number | null
  ) => {
    setTempSpecifications((prevTempSpecifications) => ({
      ...prevTempSpecifications,
      [label]: value,
    }));
  };

  const handleSelectInputChange = (
    fieldLabel: string,
    inputValue: string,
    allOptions: string[]
  ) => {
    setSelectInputValues((prev) => ({ ...prev, [fieldLabel]: inputValue }));

    const filtered = allOptions.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSelectOptions((prev) => ({ ...prev, [fieldLabel]: filtered }));

    // If the input matches an existing option, set it directly
    // Otherwise, it's considered a custom value for creatable selects
    if (allOptions.includes(inputValue)) {
      console.log("field exists", inputValue);
      handleSpecificationChange(fieldLabel, inputValue);
    } else {
      setTempSpecifications((prevSpecs) => {
        const newSpecs = { ...prevSpecs };
        // Only delete if it was previously an official option and now it's custom
        // Or if it was a custom option but the input is now empty
        const templateField = currentTemplateFieldForLabel(fieldLabel);
        if (
          templateField?.type === "select" &&
          !templateField.options.includes(tempSpecifications[fieldLabel]) &&
          !inputValue
        ) {
          delete newSpecs[fieldLabel];
        }
        return newSpecs;
      });
    }
  };

  const handleSelectOptionClick = (
    fieldLabel: string,
    selectedValue: string
  ) => {
    handleSpecificationChange(fieldLabel, selectedValue);
    setSelectInputValues((prev) => ({ ...prev, [fieldLabel]: selectedValue }));
    setFilteredSelectOptions((prev) => ({ ...prev, [fieldLabel]: [] }));
    setActiveSelectField(null);
  };

  const handleSelectInputBlur = (fieldLabel: string, allOptions: string[]) => {
    const currentValue = selectInputValues[fieldLabel];
    // If the current input value isn't among the predefined options, treat it as a custom entry.
    // Only if there's a value, otherwise clear.
    if (currentValue && !allOptions.includes(currentValue)) {
      handleSpecificationChange(fieldLabel, currentValue);
    } else if (!currentValue) {
      // If input is cleared and it's a select field, clear its value in tempSpecs
      setTempSpecifications((prevSpecs) => {
        const newSpecs = { ...prevSpecs };
        delete newSpecs[fieldLabel];
        return newSpecs;
      });
    }
    setTimeout(() => setActiveSelectField(null), 100);
  };

  const handleSelectInputFocus = (fieldLabel: string, allOptions: string[]) => {
    setFilteredSelectOptions((prev) => ({ ...prev, [fieldLabel]: allOptions }));
    setActiveSelectField(fieldLabel);
  };

  // Helper to get the template field definition for a given label
  const currentTemplateFieldForLabel = (
    label: string
  ): SpecificationField | undefined => {
    if (!category || !subcategory || !typedTemplate.specifications)
      return undefined;
    const subcategoryDef =
      typedTemplate.specifications[
        category as keyof typeof typedTemplate.specifications
      ]?.[
        subcategory as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
      ];
    if (!subcategoryDef || !("sections" in subcategoryDef)) return undefined;

    for (const section of subcategoryDef.sections) {
      for (const fieldKey in section.fields) {
        const field = section.fields[fieldKey];
        if (field.label === label) {
          return field;
        }
      }
    }
    return undefined;
  };

  const handleAddCustomSpec = () => {
    if (customSpecLabel.trim() && customSpecValue.trim()) {
      setTempSpecifications((prevTempSpecifications) => ({
        ...prevTempSpecifications,
        [customSpecLabel.trim()]: customSpecValue.trim(),
      }));
      setCustomSpecLabel("");
      setCustomSpecValue("");
      setShowCustomSpecInput(false);
    } else {
      alert(
        "Please enter both a label and a value for the custom specification."
      );
    }
  };

  const handleRemoveCustomSpec = (labelToRemove: string) => {
    setTempSpecifications((prevTempSpecifications) => {
      const newSpecs = { ...prevTempSpecifications };
      delete newSpecs[labelToRemove];
      return newSpecs;
    });
  };

  // --- MODIFIED handleOpenSpecsModal to initialize select inputs with current values ---
  const handleOpenSpecsModal = () => {
    setTempSpecifications({ ...specifications });

    const initialSelectInputs: Record<string, string> = {};
    if (category && subcategory) {
      const subcategoryDefinition =
        typedTemplate.specifications[
          category as keyof typeof typedTemplate.specifications
        ]?.[
          subcategory as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
        ];

      if (subcategoryDefinition && "sections" in subcategoryDefinition) {
        subcategoryDefinition.sections.forEach((section) => {
          for (const fieldKey in section.fields) {
            const field = section.fields[fieldKey];
            if (field.type === "select") {
              const currentValue = specifications[field.label];
              if (currentValue !== undefined) {
                initialSelectInputs[field.label] = String(currentValue);
              } else if (field.default !== undefined) {
                initialSelectInputs[field.label] = String(field.default);
              }
            }
          }
        });
      }
    }
    setSelectInputValues(initialSelectInputs);
    setShowSpecsModal(true);
  };

  const handleSaveSpecsModal = () => {
    setSpecifications({ ...tempSpecifications });
    setShowSpecsModal(false);
  };

  const handleCancelSpecsModal = () => {
    setShowSpecsModal(false);
    setShowCustomSpecInput(false);
    setCustomSpecLabel("");
    setCustomSpecValue("");
    // Re-initialize select input values based on actual specifications if modal is cancelled
    const resetSelectInputs: Record<string, string> = {};
    if (category && subcategory) {
      const subcategoryDefinition =
        typedTemplate.specifications[
          category as keyof typeof typedTemplate.specifications
        ]?.[
          subcategory as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
        ];
      if (subcategoryDefinition && "sections" in subcategoryDefinition) {
        subcategoryDefinition.sections.forEach((section) => {
          for (const fieldKey in section.fields) {
            const field = section.fields[fieldKey];
            if (
              field.type === "select" &&
              specifications[field.label] !== undefined
            ) {
              resetSelectInputs[field.label] = String(
                specifications[field.label]
              );
            }
          }
        });
      }
    }
    setSelectInputValues(resetSelectInputs);
    setFilteredSelectOptions({});
    setActiveSelectField(null);
  };

  // --- MODIFIED renderField to handle new types and units ---
  const renderField = (
    field: SpecificationField,
    currentSpecs: Record<string, any>
  ) => {
    const commonProps = {
      id: field.label.replace(/\s/g, "_").toLowerCase(), // Generate a simple ID
      name: field.label,
      placeholder: field.placeholder,
      required: field.required,
      style: {
        width: "100%",
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #ddd",
      },
    };

    switch (field.type) {
      case "text":
        return (
          <div key={field.label} style={{ marginBottom: "15px" }}>
            <label htmlFor={commonProps.id}>
              {field.label}
              {field.unit_hint ? ` (${field.unit_hint})` : ""}:
            </label>
            <input
              type="text"
              value={currentSpecs[field.label] || ""}
              onChange={(e) =>
                handleSpecificationChange(field.label, e.target.value)
              }
              {...commonProps}
            />
          </div>
        );
      case "number":
        const numberField = field as NumberField;
        return (
          <div key={field.label} style={{ marginBottom: "15px" }}>
            <label htmlFor={commonProps.id}>
              {field.label}
              {numberField.unit ? ` (${numberField.unit})` : ""}:
            </label>
            <input
              type="number"
              value={currentSpecs[field.label] || ""}
              onChange={(e) =>
                handleSpecificationChange(
                  field.label,
                  parseFloat(e.target.value) || ""
                )
              } // Parse to number
              min={numberField.min}
              max={numberField.max}
              step={numberField.step}
              {...commonProps}
            />
          </div>
        );
      case "select":
        const selectField = field as SelectField;
        const options = Array.isArray(selectField.options)
          ? selectField.options.map((opt: any) =>
              typeof opt === "object" ? opt.value : opt
            )
          : [];
        const currentInputValue =
          selectInputValues[field.label] || currentSpecs[field.label] || "";
        const currentFilteredOptions = filteredSelectOptions[field.label] || [];

        if (selectField.multiple) {
          const selectedValues: string[] = currentSpecs[field.label] || [];
          return (
            <div key={field.label} style={{ marginBottom: "15px" }}>
              <label>{field.label}:</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  marginBottom: "8px",
                }}
              >
                {options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    style={{
                      padding: "8px 12px",
                      borderRadius: "20px",
                      border: `1px solid ${
                        selectedValues.includes(option) ? "#2E6F94" : "#ccc"
                      }`,
                      backgroundColor: selectedValues.includes(option)
                        ? "#e6f2f8"
                        : "#fff",
                      color: selectedValues.includes(option)
                        ? "#2E6F94"
                        : "#333",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                    onClick={() => {
                      const newValues = selectedValues.includes(option)
                        ? selectedValues.filter((v) => v !== option)
                        : [...selectedValues, option];
                      handleSpecificationChange(field.label, newValues);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div
            key={field.label}
            style={{ marginBottom: "15px", position: "relative" }}
          >
            <label htmlFor={commonProps.id}>{field.label}:</label>
            <input
              type="text"
              value={currentInputValue}
              onChange={(e) =>
                handleSelectInputChange(field.label, e.target.value, options)
              }
              onFocus={() => handleSelectInputFocus(field.label, options)}
              onBlur={() => handleSelectInputBlur(field.label, options)}
              {...commonProps}
              autoComplete="off" // Prevent browser autocomplete
            />
            {activeSelectField === field.label &&
              currentFilteredOptions.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    width: "100%",
                    maxHeight: "200px",
                    overflowY: "auto",
                    listStyle: "none",
                    padding: "0",
                    margin: "0",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {currentFilteredOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleSelectOptionClick(field.label, option)
                      }
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        );
      case "textarea":
        return (
          <div key={field.label} style={{ marginBottom: "15px" }}>
            <label htmlFor={commonProps.id}>{field.label}:</label>
            <textarea
              value={currentSpecs[field.label] || ""}
              onChange={(e) =>
                handleSpecificationChange(field.label, e.target.value)
              }
              {...commonProps}
              style={{ ...commonProps.style, minHeight: "80px" }}
            />
          </div>
        );
      case "file":
        const fileField = field as FileField;
        return (
          <div key={field.label} style={{ marginBottom: "15px" }}>
            <label htmlFor={commonProps.id}>{field.label}:</label>
            <input
              type="file"
              multiple={fileField.multiple}
              accept={fileField.accept}
              onChange={(e) =>
                handleSpecificationChange(field.label, e.target.files)
              }
              {...commonProps}
            />
          </div>
        );
      case "boolean":
        const booleanField = field as BooleanField;
        return (
          <div
            key={field.label}
            style={{
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <label htmlFor={commonProps.id} style={{ marginRight: "10px" }}>
              {field.label}:
            </label>
            <input
              type="checkbox"
              checked={!!currentSpecs[field.label]} // Convert to boolean
              onChange={(e) =>
                handleSpecificationChange(field.label, e.target.checked)
              }
              // style={{ width: 'auto', height: 'auto', margin: '0' }}
              {...commonProps}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const setImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const imgsrc = URL.createObjectURL(selectedFile);

      setimgF(selectedFile);
      setdefaultImg(imgsrc);

      setlistData((prevlistData) => ({
        ...prevlistData,
        prevImg: [...prevlistData.prevImg, imgsrc],
      }));
      console.log("Selected file URL:", imgsrc);
    } else {
      console.log("No file selected.");
    }
  };

  const handlePublish = () => {
    const dataToSend = {
      ProductName: listData.Title,
      Description: listData.Description,
      Summary: listData.Summary,
      Price: listData.Price,
      IsAvailable: true,
      Quantity: listData.Quantity,
      Category: category, // Use dynamic category
      SellingType: listData.sellType, // Use dynamic sellType
      Condition: listData.Condition, // Use dynamic condition
      Specification: JSON.stringify(listData.Specification),
    };

    const fd = new FormData();
    for (const [key, value] of Object.entries(dataToSend)) {
      console.log(`${key}:`, value);
      fd.append(key, String(value));
    }

    if (imgF) {
      fd.append("ImageFile", imgF, imgF.name);
    }

    console.log("FormData Contents:");
    for (const pair of fd.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // Example for shipping details from the product section
    // You'd need to extract these from listData similarly to specifications
    const shippingDetails = typedTemplate.product.shipping.fields;
    for (const key in shippingDetails) {
      const field = shippingDetails[key as keyof typeof shippingDetails];
      // Assuming shipping details are stored directly in listData or another state
      // For now, I'll just append dummy values or leave it to your implementation
      if (field.label === "Shipping Cost") {
        fd.append("ShippingCost", String(listData.Price)); // Placeholder
      }
      if (field.label === "Shipping Method") {
        fd.append("ShippingMethod", "Standard"); // Placeholder
      }
    }

    // PublishItems(fd); // Uncomment when ready to integrate with API
  };

  useEffect(() => {
    setlistData((prevListData) => ({
      ...prevListData,
      Specification: specifications,
    }));
  }, [specifications]);

  const isSelectField = (field: SpecificationField): field is SelectField =>
    field.type === "select";

  const selectedCategory = typedTemplate.product.category.options.find(
    (opt) => opt.value === category
  );
  return (
    <>
      <div className="container" style={{ marginTop: "100px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "48px" }}>
          Buy. Sell. Trade
        </h1>

        {showInitialSearch ? (
          <>
            <input
              type="text"
              placeholder="What do you want to sell or trade?"
              value={listData.Title}
              style={{
                width: "90%",
                height: "48px",
                fontSize: "1.5rem",
                fontWeight: "400",
                padding: "8px 16px",
                margin: "0 auto",
                boxShadow: "var(--primary-shadow)",
                borderRadius: "24px",
                border: "none",
              }}
              onChange={handleSearchInputChange}
            />
            <div style={{ margin: "24px auto" }}>
              {isMatched === false && (
                <span style={{ color: "red", marginRight: "10px" }}>
                  No match found
                </span>
              )}
              {isMatched === true && (
                <span style={{ color: "green", marginRight: "10px" }}>
                  Match found!
                </span>
              )}
              <button
                style={{
                  background: "#2E6F94",
                  color: "#FFF",
                  width: "100px",
                  padding: "8px",
                  borderRadius: "24px",
                  marginLeft: "24px",
                }}
                onClick={handleContinueClick}
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ margin: "24px auto", textAlign: "left" }}>
              <button
                style={{
                  background: "#6c757d",
                  color: "#FFF",
                  width: "100px",
                  padding: "8px",
                  borderRadius: "24px",
                }}
                onClick={handleBackClick}
              >
                Back
              </button>
            </div>

            {showFullListingForm && (
              <div style={{ display: "block" }}>
                {/* CATEGORY & SUBCATEGORY CARD SELECTION */}
                <section>
                  <h5>Select a Category</h5>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "15px",
                      justifyContent: "center",
                    }}
                  >
                    {typedTemplate &&
                      typedTemplate.product &&
                      typedTemplate.product.category &&
                      typedTemplate.product.category.options.map(
                        (option: any) => (
                          <div
                            key={option.value}
                            onClick={() =>
                              handleCategoryCardClick(option.value)
                            }
                            style={{
                              padding: "10px",
                              border: `2px solid ${
                                category === option.value ? "#2E6F94" : "#ccc"
                              }`,
                              borderRadius: "10px",
                              cursor: "pointer",
                              backgroundColor:
                                category === option.value ? "#e6f2f8" : "#fff",
                              fontWeight:
                                category === option.value ? "bold" : "normal",
                              textAlign: "center",
                              minWidth: "120px",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            {option.imageUrl && (
                              <img
                                src={option.imageUrl}
                                alt={option.label}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "contain",
                                  marginBottom: "8px",
                                }}
                              />
                            )}
                            <span>{option.label}</span>
                          </div>
                        )
                      )}
                  </div>
                  {category && selectedCategory && (
                    <>
                      <h5 style={{ marginTop: "20px" }}>
                        Select a Subcategory ({selectedCategory.label})
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "15px",
                          justifyContent: "center",
                        }}
                      >
                        {typedTemplate.product.category.options
                          .find(
                            (opt: { value: string }) => opt.value === category
                          )
                          ?.subcategories.map((sub: any) => (
                            <div
                              key={sub.value}
                              onClick={() =>
                                handleSubcategoryCardClick(sub.value)
                              }
                              style={{
                                padding: "10px",
                                border: `2px solid ${
                                  subcategory === sub.value ? "#2E6F94" : "#ccc"
                                }`,
                                borderRadius: "10px",
                                cursor: "pointer",
                                backgroundColor:
                                  subcategory === sub.value
                                    ? "#e6f2f8"
                                    : "#fff",
                                fontWeight:
                                  subcategory === sub.value ? "bold" : "normal",
                                textAlign: "center",
                                minWidth: "120px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              {sub.imageUrl && (
                                <img
                                  src={sub.imageUrl}
                                  alt={sub.label}
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "contain",
                                    marginBottom: "8px",
                                  }}
                                />
                              )}
                              <span>{sub.label}</span>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </section>

                {/* LISTING DETAILS SECTION */}
                <section>
                  <h5>Listing Details</h5>
                  <div className="listDetail">
                    <h6>Title</h6>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "16px",
                        width: "100%",
                      }}
                    >
                      <input
                        type="text"
                        value={listData.Title}
                        name="Title"
                        placeholder="Enter name of item"
                        onChange={handelDataChange}
                        style={{
                          width: "100%",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      />
                    </p>

                    <div className="ConTyQty">
                      <div className="Con">
                        <h6>Condition</h6>
                        <select
                          name="Condition"
                          value={listData.Condition}
                          onChange={handelDataChange}
                        >
                          <option value="">Select Condition</option>
                          {typedTemplate.product.condition.options.map(
                            (option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div className="Ty">
                        <h6>Listing Type</h6>
                        <input
                          type="radio"
                          name="sellType"
                          value="Buy now"
                          checked={listData.sellType === "Buy now"}
                          onChange={handelDataChange}
                        />{" "}
                        <span>Buy now </span>
                        <input
                          type="radio"
                          name="sellType"
                          value="Auction"
                          checked={listData.sellType === "Auction"}
                          onChange={handelDataChange}
                        />{" "}
                        <span>Auction </span>
                      </div>
                      <div className="Qty">
                        <h6>Quantity</h6>
                        <input
                          type="number"
                          name="Quantity"
                          value={listData.Quantity}
                          onChange={handelDataChange}
                          min="1"
                          style={{ width: "60px" }}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* --- SPECIFICATIONS SECTION (NOW WITH MODAL TRIGGER) --- */}
                <section>
                  <h5>Specifications</h5>
                  <div className="listSpecs">
                    {/* Display a summary of active specifications */}
                    {category &&
                    subcategory &&
                    Object.keys(specifications).length > 0 ? (
                      <div>
                        <p>
                          <strong>Current Specifications:</strong>
                        </p>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                          {Object.entries(specifications).map(
                            ([key, value]) => (
                              <li key={key} style={{ marginBottom: "5px" }}>
                                <strong>{key}:</strong>{" "}
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : String(value)}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ) : (
                      <p>No specifications added yet.</p>
                    )}

                    {/* Button to open the modal */}
                    <button
                      type="button"
                      onClick={handleOpenSpecsModal}
                      style={{
                        marginTop: "15px",
                        background: "#2E6F94",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                    >
                      {Object.keys(specifications).length > 0
                        ? "Edit Specifications"
                        : "Add Specifications"}
                    </button>
                  </div>
                </section>

                {/* DESCRIPTION SECTION */}
                <section>
                  <h5>Description</h5>
                  <div className="listDesc">
                    <textarea
                      name="Description"
                      value={listData.Description}
                      placeholder="Please enter a good description of your item, to help it sell better"
                      onChange={handelDataChange}
                      style={{ borderRadius: "10px" }}
                    />
                  </div>
                </section>

                {/* PRICING SECTION */}
                <section>
                  <h5>Pricing</h5>
                  <div className="listPrice">
                    <div className="setPrice">
                      <p>Recommended</p>
                      <p>Enter a competitive price to sell faster</p>
                      <label htmlFor="Price">
                        <h5>Price</h5>
                      </label>
                      <input
                        type="text"
                        value={listData.Price}
                        name="Price"
                        onChange={handelDataChange}
                        style={{
                          marginLeft: "8px",
                          fontSize: "20px",
                          color: "#2E6F94",
                        }}
                      />

                      <p>Accepting Offer</p>
                    </div>
                    <div className="setSmartPrice">
                      <p>
                        Smart Pricing{" "}
                        <span>
                          <IoToggleSharp
                            style={{ color: "green", fontSize: "1.5rem" }}
                          />
                        </span>
                      </p>
                      <p style={{ width: "350px", fontSize: "small" }}>
                        Smart Pricing automatically drops the price of your
                        listing by 10% at the best time every week until it hits
                        your floor price.
                      </p>
                      <p>
                        Floor Price{" "}
                        <span style={{ color: "green", fontSize: "1.5rem" }}>
                          GHc 999.99
                        </span>
                      </p>
                    </div>
                  </div>
                </section>
                {/* Render shipping details directly */}
                <div style={{ marginTop: "20px" }}>
                  <h6>Shipping Details</h6>
                  {Object.entries(typedTemplate.product.shipping.fields).map(
                    ([key, field]) => {
                      const commonProps = {
                        id: `shipping-${field.label
                          .replace(/\s/g, "_")
                          .toLowerCase()}`,
                        name: field.label,
                        placeholder: field.placeholder,
                        required: field.required,
                        style: {
                          width: "100%",
                          padding: "8px",
                          borderRadius: "5px",
                          border: "1px solid #ddd",
                        },
                      };

                      switch (field.type) {
                        case "text":
                          return (
                            <div key={key} style={{ marginBottom: "10px" }}>
                              <label htmlFor={commonProps.id}>
                                {field.label}
                                {field.unit_hint ? ` (${field.unit_hint})` : ""}
                                :
                              </label>
                              <input
                                type="text"
                                value={
                                  (listData as any)[field.label] ||
                                  field.default ||
                                  ""
                                } // Assuming shipping fields might be in listData
                                onChange={handelDataChange}
                                {...commonProps}
                              />
                            </div>
                          );
                        case "number":
                          const numField = field as NumberField;
                          return (
                            <div key={key} style={{ marginBottom: "10px" }}>
                              <label htmlFor={commonProps.id}>
                                {field.label}
                                {numField.unit ? ` (${numField.unit})` : ""}:
                              </label>
                              <input
                                type="number"
                                value={
                                  (listData as any)[field.label] ||
                                  numField.default ||
                                  ""
                                }
                                onChange={handelDataChange}
                                min={numField.min}
                                max={numField.max}
                                step={numField.step}
                                {...commonProps}
                              />
                            </div>
                          );
                        case "select":
                          if (!isSelectField(field)) return null;
                          const options = Array.isArray(field.options)
                            ? field.options.map((opt) =>
                                typeof opt === "object" ? opt.value : opt
                              )
                            : [];
                          return (
                            <div
                              key={field.label}
                              style={{ marginBottom: "15px" }}
                            >
                              <label htmlFor={commonProps.id}>
                                {field.label}:
                              </label>
                              <select
                                value={tempSpecifications[field.label] || ""}
                                onChange={(e) => handelDataChange(e)}
                                {...commonProps}
                              >
                                <option value="">Select an option</option>
                                {options.map((opt, idx) => (
                                  <option key={idx} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        case "boolean":
                          const boolField = field as BooleanField;
                          return (
                            <div
                              key={key}
                              style={{
                                marginBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <label
                                htmlFor={commonProps.id}
                                style={{ marginRight: "10px" }}
                              >
                                {field.label}:
                              </label>
                              <input
                                type="checkbox"
                                checked={
                                  !!(listData as any)[field.label] ||
                                  !!boolField.default
                                }
                                onChange={(e) =>
                                  handelDataChange({
                                    ...e,
                                    target: {
                                      ...e.target,
                                      name: field.label,
                                      value: e.target.checked,
                                    } as any,
                                  })
                                } // Cast for boolean change
                                //style={{ width: 'auto', height: 'auto', margin: '0' }}
                                {...commonProps}
                              />
                            </div>
                          );
                        default:
                          return null;
                      }
                    }
                  )}
                </div>

                {/* PHOTOS SECTION */}
                <section>
                  <h5>Photos</h5>
                  <div className="listPhotos">
                    <ol className="lphotogrid">
                      <li className="pmain">
                        {defaultImg && <img src={defaultImg} alt="main" />}
                      </li>
                      {listData.prevImg.map((src, index) => {
                        if (src === defaultImg) return null;
                        return (
                          <li key={index}>
                            <img src={src} alt={`preview ${index}`} />
                          </li>
                        );
                      })}
                      <li className="pone"></li>
                      <li className="ptwo"></li>
                      <li className="padd">
                        <input
                          type="file"
                          accept="image/*"
                          name="addIMG"
                          style={{
                            opacity: 0,
                            position: "absolute",
                            cursor: "pointer",
                            width: "48",
                            height: "48",
                          }}
                          onChange={setImg}
                        />
                        <IoAddCircle
                          style={{ fontSize: "3rem", cursor: "pointer" }}
                        />
                      </li>
                    </ol>
                  </div>
                </section>

                <button type="button" onClick={handlePublish}>
                  Publish
                </button>
              </div>
            )}
          </>
        )}

        {/* --- SPECIFICATIONS MODAL --- */}
        {showSpecsModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                width: "90%",
                maxWidth: "700px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                position: "relative",
              }}
            >
              <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
                Edit Specifications
              </h2>

              <div className="listSpecs">
                {category &&
                  subcategory &&
                  typedTemplate.specifications &&
                  typedTemplate.specifications[
                    category as keyof typeof typedTemplate.specifications
                  ] &&
                  typedTemplate.specifications[
                    category as keyof typeof typedTemplate.specifications
                  ][
                    subcategory as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
                  ] &&
                  ("sections" in
                  typedTemplate.specifications[
                    category as keyof typeof typedTemplate.specifications
                  ][
                    subcategory as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
                  ]
                    ? typedTemplate.specifications[
                        category as keyof typeof typedTemplate.specifications
                      ][
                        subcategory as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
                      ].sections.map((section, sectionIndex) => (
                        <div
                          key={sectionIndex}
                          style={{
                            marginBottom: "25px",
                            border: "1px solid #eee",
                            borderRadius: "8px",
                            padding: "15px",
                          }}
                        >
                          <h6
                            style={{
                              marginTop: "0",
                              marginBottom: "15px",
                              color: "#2E6F94",
                            }}
                          >
                            {section.label}
                          </h6>
                          {Object.entries(section.fields).map(
                            ([key, field]) =>
                              renderField(field, tempSpecifications) // Pass tempSpecifications
                          )}
                        </div>
                      ))
                    : // Fallback for subcategories without sections, if any were left (though template now uses sections)
                      Object.entries(
                        typedTemplate.specifications[
                          category as keyof typeof typedTemplate.specifications
                        ][
                          subcategory as keyof (typeof typedTemplate.specifications)[keyof typeof typedTemplate.specifications]
                        ]
                      ).map(([key, field]) =>
                        renderField(
                          field as SpecificationField,
                          tempSpecifications
                        )
                      ))}

                {/* Display currently added custom specifications with a remove button */}
                {Object.entries(tempSpecifications).map(([label, value]) => {
                  // Check if this label is part of the predefined template fields (in any section)
                  const isTemplateField = currentTemplateFieldForLabel(label);

                  if (!isTemplateField) {
                    return (
                      <div
                        key={`custom-${label}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                          border: "1px dashed #ccc",
                          padding: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", marginRight: "5px" }}
                        >
                          {label}:
                        </span>
                        <span>
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </span>
                        <button
                          onClick={() => handleRemoveCustomSpec(label)}
                          style={{
                            marginLeft: "10px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            padding: "3px 8px",
                          }}
                        >
                          X
                        </button>
                      </div>
                    );
                  }
                  return null;
                })}

                {/* Button to show custom spec input fields */}
                <button
                  type="button"
                  onClick={() => setShowCustomSpecInput(true)}
                  style={{
                    marginTop: "15px",
                    background: "#007bff",
                    color: "white",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Add New Specification Type
                </button>

                {/* Custom spec input fields (conditionally rendered) */}
                {showCustomSpecInput && (
                  <div
                    style={{
                      marginTop: "15px",
                      border: "1px solid #eee",
                      padding: "15px",
                      borderRadius: "8px",
                    }}
                  >
                    <h6>
                      New Custom Specification (e.g., "Processor Type" : "Intel
                      i9")
                    </h6>
                    <div style={{ marginBottom: "10px" }}>
                      <label htmlFor="custom-label-modal">Label:</label>
                      <input
                        id="custom-label-modal"
                        type="text"
                        value={customSpecLabel}
                        onChange={(e) => setCustomSpecLabel(e.target.value)}
                        placeholder="e.g., Color"
                        style={{
                          marginLeft: "5px",
                          padding: "5px",
                          borderRadius: "3px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="custom-value-modal">Value:</label>
                      <input
                        id="custom-value-modal"
                        type="text"
                        value={customSpecValue}
                        onChange={(e) => setCustomSpecValue(e.target.value)}
                        placeholder="e.g., Blue"
                        style={{
                          marginLeft: "5px",
                          padding: "5px",
                          borderRadius: "3px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomSpec}
                      style={{
                        marginTop: "10px",
                        background: "#28a745",
                        color: "white",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomSpecInput(false);
                        setCustomSpecLabel("");
                        setCustomSpecValue("");
                      }}
                      style={{
                        marginTop: "10px",
                        marginLeft: "10px",
                        background: "#dc3545",
                        color: "white",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "30px",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancelSpecsModal}
                  style={{
                    background: "#6c757d",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSpecsModal}
                  style={{
                    background: "#2E6F94",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Save Specifications
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellListing;
