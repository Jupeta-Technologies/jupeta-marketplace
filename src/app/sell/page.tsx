"use client";

import React, { useEffect, useState } from "react";
import { IoToggleSharp, IoAddCircle } from "react-icons/io5";
import { PublishItems } from "@/lib/api/PublishItemsAPI";
import ItemCard from "@/components/card/ItemCard";
import TradeItemCard from "@/components/card/TradeItemCard";
import { Product, TradeItem } from "@/types/api";
import template from "./template/productBase-template.json"; // Make sure this path is correct

// Extended interface for mock items with additional properties
interface MockProduct extends Product {
  seller?: string;
  location?: string;
  tradeValue?: string;
  tradeLookingFor?: string;
}

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
  
  // Auction specific fields
  auctionStartDate: string;
  auctionStartTime: string;
  auctionEndDate: string;
  auctionEndTime: string;
  auctionReservePrice: string;
  auctionBuyNowPrice: string;
  auctionStartOption: string; // "now" or "scheduled"
  auctionLength: string; // Number of days as string
  acceptOffers: boolean;
  
  // Trade specific fields
  tradeDescription: string;
  tradePreferences: string[];
  tradeValue: string;
  acceptCash: boolean;
  
  // Smart pricing
  smartPricing: boolean;
  floorPrice: string;
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
  const [showPreview, setShowPreview] = useState(false);
  const [showExistingItems, setShowExistingItems] = useState(false);
  const [existingItems, setExistingItems] = useState<MockProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExistingItem, setSelectedExistingItem] = useState<MockProduct | null>(null);
  const [tradeItems, setTradeItems] = useState<TradeItem[]>([]);
  const [selectedTradeItem, setSelectedTradeItem] = useState<TradeItem | null>(null);
  const [showTradeItems, setShowTradeItems] = useState(false);

  // Add loading and error states for publishing
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

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
    
    // Auction specific fields
    auctionStartDate: "",
    auctionStartTime: "",
    auctionEndDate: "",
    auctionEndTime: "",
    auctionReservePrice: "",
    auctionBuyNowPrice: "",
    auctionStartOption: "now", // Default to immediate start
    auctionLength: "7", // Default to 7 days
    acceptOffers: false,
    
    // Trade specific fields
    tradeDescription: "",
    tradePreferences: [],
    tradeValue: "",
    acceptCash: false,
    
    // Smart pricing
    smartPricing: false,
    floorPrice: "",
  });

  const checkForMatch = (title: string): boolean => {
    return title.trim().toLowerCase() === "hello";
  };

  // Function to search for existing items
  const searchExistingItems = async (query: string) => {
    if (query.trim().length < 3) {
      setExistingItems([]);
      setShowExistingItems(false);
      return;
    }

    // Mock data - replace with actual API call
    const mockItems: MockProduct[] = [
      {
        id: "1",
        productName: "iPhone 14 Pro Max 256GB",
        description: "Excellent condition iPhone 14 Pro Max with 256GB storage. No scratches, original box included.",
        summary: "Premium iPhone in excellent condition",
        price: 2500.00,
        isAvailable: true,
        quantity: 1,
        category: "Electronics",
        condition: "Excellent",
        sellingType: "BuyNow",
        productImage: "iphone-14-pro-max.jpg",
        imageFileUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        productImages: [{
          imageId: "img1",
          imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
          imagePath: "/images/iphone-14-pro-max.jpg",
          isPrimary: true,
          displayOrder: 1,
          altText: "iPhone 14 Pro Max",
          uploadedAt: "2024-01-01T00:00:00Z"
        }],
        imageFile: null,
        addedAt: "2024-01-01T00:00:00Z",
        modifiedOn: "2024-01-01T00:00:00Z",
        qty: 1,
        onAdd: () => {},
        seller: "John Doe",
        location: "Accra, Ghana"
      },
      {
        id: "2",
        productName: "iPhone 13 Pro 128GB",
        description: "Good condition iPhone 13 Pro. Minor wear but fully functional. Comes with charger.",
        summary: "Reliable iPhone at great price",
        price: 1800.00,
        isAvailable: true,
        quantity: 1,
        category: "Electronics",
        condition: "Good",
        sellingType: "Auction",
        productImage: "iphone-13-pro.jpg",
        imageFileUrl: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400",
        productImages: [{
          imageId: "img2",
          imageUrl: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400",
          imagePath: "/images/iphone-13-pro.jpg",
          isPrimary: true,
          displayOrder: 1,
          altText: "iPhone 13 Pro",
          uploadedAt: "2024-01-01T00:00:00Z"
        }],
        imageFile: null,
        addedAt: "2024-01-01T00:00:00Z",
        modifiedOn: "2024-01-01T00:00:00Z",
        qty: 1,
        onAdd: () => {},
        seller: "Jane Smith",
        location: "Kumasi, Ghana"
      },
      {
        id: "3",
        productName: "Samsung Galaxy S23 Ultra",
        description: "Like new Samsung Galaxy S23 Ultra. Looking to trade for iPhone or MacBook. Open to cash combinations.",
        summary: "Premium Android phone for trade",
        price: 0, // Trade items don't have a selling price
        isAvailable: true,
        quantity: 1,
        category: "Electronics",
        condition: "Like New",
        sellingType: "Trade",
        productImage: "galaxy-s23-ultra.jpg",
        imageFileUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
        productImages: [{
          imageId: "img3",
          imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
          imagePath: "/images/galaxy-s23-ultra.jpg",
          isPrimary: true,
          displayOrder: 1,
          altText: "Samsung Galaxy S23 Ultra",
          uploadedAt: "2024-01-01T00:00:00Z"
        }],
        imageFile: null,
        addedAt: "2024-01-01T00:00:00Z",
        modifiedOn: "2024-01-01T00:00:00Z",
        qty: 1,
        onAdd: () => {},
        tradeValue: "2000.00",
        tradeLookingFor: "iPhone or MacBook",
        seller: "Mike Johnson",
        location: "Tema, Ghana"
      },
      {
        id: "4",
        productName: "iPhone 12 Mini 64GB",
        description: "Fair condition iPhone 12 Mini. Screen has minor scratches but fully functional.",
        summary: "Compact iPhone at budget price",
        price: 1200.00,
        isAvailable: true,
        quantity: 1,
        category: "Electronics",
        condition: "Fair",
        sellingType: "BuyNow",
        productImage: "iphone-12-mini.jpg",
        imageFileUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
        productImages: [{
          imageId: "img4",
          imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
          imagePath: "/images/iphone-12-mini.jpg",
          isPrimary: true,
          displayOrder: 1,
          altText: "iPhone 12 Mini",
          uploadedAt: "2024-01-01T00:00:00Z"
        }],
        imageFile: null,
        addedAt: "2024-01-01T00:00:00Z",
        modifiedOn: "2024-01-01T00:00:00Z",
        qty: 1,
        onAdd: () => {},
        seller: "Sarah Wilson",
        location: "Takoradi, Ghana"
      },
      {
        id: "5",
        productName: "MacBook Pro M2 16-inch",
        description: "Like new MacBook Pro with M2 chip. Perfect for developers and creators. Comes with original accessories.",
        summary: "Powerful laptop in excellent condition",
        price: 3500.00,
        isAvailable: true,
        quantity: 1,
        category: "Electronics",
        condition: "Like New",
        sellingType: "BuyNow",
        productImage: "macbook-pro-m2.jpg",
        imageFileUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        productImages: [{
          imageId: "img5",
          imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
          imagePath: "/images/macbook-pro-m2.jpg",
          isPrimary: true,
          displayOrder: 1,
          altText: "MacBook Pro M2",
          uploadedAt: "2024-01-01T00:00:00Z"
        }],
        imageFile: null,
        addedAt: "2024-01-01T00:00:00Z",
        modifiedOn: "2024-01-01T00:00:00Z",
        qty: 1,
        onAdd: () => {},
        seller: "David Chen",
        location: "Accra, Ghana"
      },
      {
        id: "6",
        productName: "MacBook Air M1 13-inch",
        description: "Excellent condition MacBook Air. Looking to trade for gaming laptop or desktop setup. Also accepting cash offers.",
        summary: "Lightweight laptop perfect for students",
        price: 0, // Trade item
        isAvailable: true,
        quantity: 1,
        category: "Electronics",
        condition: "Excellent",
        sellingType: "Trade",
        productImage: "macbook-air-m1.jpg",
        imageFileUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
        productImages: [{
          imageId: "img6",
          imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
          imagePath: "/images/macbook-air-m1.jpg",
          isPrimary: true,
          displayOrder: 1,
          altText: "MacBook Air M1",
          uploadedAt: "2024-01-01T00:00:00Z"
        }],
        imageFile: null,
        addedAt: "2024-01-01T00:00:00Z",
        modifiedOn: "2024-01-01T00:00:00Z",
        qty: 1,
        onAdd: () => {},
        tradeValue: "2800.00",
        tradeLookingFor: "Gaming laptop or cash",
        seller: "Lisa Brown",
        location: "Kumasi, Ghana"
      }
    ];

    // Filter items based on search query
    const filtered = mockItems.filter(item => 
      item.productName.toLowerCase().includes(query.toLowerCase())
    );

    setExistingItems(filtered);
    setShowExistingItems(filtered.length > 0);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 3) {
        searchExistingItems(searchQuery);
        searchTradeItems(searchQuery);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchExistingItems(searchQuery);
  };

  const handleSelectExistingItem = (item: MockProduct) => {
    // Toggle selection - if already selected, deselect; otherwise select the new item
    if (selectedExistingItem?.id === item.id) {
      setSelectedExistingItem(null);
    } else {
      setSelectedExistingItem(item);
    }
  };

  const handleContinueWithSelected = () => {
    if (selectedExistingItem) {
      // Pre-fill the listing form with the selected item data
      setlistData(prev => ({
        ...prev,
        Title: selectedExistingItem.productName,
        Description: selectedExistingItem.description || '',
        Category: selectedExistingItem.category,
        Condition: selectedExistingItem.condition,
        Price: selectedExistingItem.price?.toString() || '',
        SellingType: selectedExistingItem.sellingType,
        // Add additional fields based on selling type
        ...(selectedExistingItem.sellingType === "Trade" && {
          TradeValue: selectedExistingItem.price?.toString() || '',
          TradeLookingFor: ''
        })
      }));
      
      // Navigate to listing form
      setShowExistingItems(false);
      setShowTradeItems(false);
      setShowInitialSearch(false);
      setShowFullListingForm(true);
      setIsMatched(false);
      setSelectedExistingItem(null);
    }
  };

  // Group items by selling type
  const groupedItems = existingItems.reduce((groups, item) => {
    const type = item.sellingType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {} as Record<string, MockProduct[]>);

  // Mock trade items data
  const getMockTradeItems = (): TradeItem[] => {
    return [
      {
        id: "trade1",
        name: "iPhone 13 Pro 256GB",
        image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&h=400&fit=crop",
        condition: "Excellent",
        estimatedValue: 2200,
        description: "iPhone 13 Pro in excellent condition, barely used for 6 months. No scratches, original box and accessories included.",
        category: "Electronics",
        seller: "John Doe",
        location: "Accra, Ghana",
        lookingFor: "MacBook Air or Cash"
      },
      {
        id: "trade2",
        name: "Samsung Galaxy S23 Ultra",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
        condition: "Like New",
        estimatedValue: 2800,
        description: "Samsung Galaxy S23 Ultra with S Pen, purchased 3 months ago. Perfect condition with screen protector applied from day one.",
        category: "Electronics",
        seller: "Jane Smith",
        location: "Kumasi, Ghana",
        lookingFor: "iPhone 14 Pro or Gaming Laptop"
      },
      {
        id: "trade3",
        name: "MacBook Air M1 13-inch",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
        condition: "Good",
        estimatedValue: 2500,
        description: "MacBook Air M1 used for student work. Some minor wear on corners but fully functional with great battery life.",
        category: "Electronics",
        seller: "Mike Johnson",
        location: "Tema, Ghana",
        lookingFor: "Gaming Desktop or Cash + iPhone"
      },
      {
        id: "trade4",
        name: "Sony PlayStation 5",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
        condition: "Excellent",
        estimatedValue: 1800,
        description: "PlayStation 5 with two controllers and 5 games. Excellent condition, adult owned, smoke-free home.",
        category: "Gaming",
        seller: "Sarah Wilson",
        location: "Takoradi, Ghana",
        lookingFor: "Nintendo Switch + Cash or High-end Phone"
      },
      {
        id: "trade5",
        name: "Canon EOS R6 Camera",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
        condition: "Like New",
        estimatedValue: 3500,
        description: "Canon EOS R6 mirrorless camera with 24-70mm lens. Used for 6 months, excellent condition with low shutter count.",
        category: "Photography",
        seller: "David Chen",
        location: "Accra, Ghana",
        lookingFor: "MacBook Pro + Cash or High-end Video Equipment"
      },
      {
        id: "trade6",
        name: "iPad Pro 12.9-inch M2",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
        condition: "Excellent",
        estimatedValue: 2800,
        description: "iPad Pro 12.9-inch with M2 chip, Apple Pencil, and Magic Keyboard. Perfect for creative work and productivity.",
        category: "Electronics",
        seller: "Lisa Brown",
        location: "Kumasi, Ghana",
        lookingFor: "MacBook Air or iPhone 15 Pro + Cash"
      }
    ];
  };

  const handleCreateNewListing = () => {
    // User wants to create a new listing instead of selecting existing
    setShowExistingItems(false);
    setSelectedExistingItem(null); // Reset selection
    setShowTradeItems(false);
    setSelectedTradeItem(null);
    const result = checkForMatch(searchQuery);
    setIsMatched(result);
    setShowInitialSearch(false);
    setShowFullListingForm(true);
    setlistData(prev => ({ ...prev, Title: searchQuery }));
  };

  const searchTradeItems = (query: string) => {
    if (query.trim().length < 3) {
      setTradeItems([]);
      setShowTradeItems(false);
      return;
    }

    const mockTradeItems = getMockTradeItems();
    const filtered = mockTradeItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.lookingFor.toLowerCase().includes(query.toLowerCase())
    );

    setTradeItems(filtered);
    setShowTradeItems(filtered.length > 0);
  };

  const handleSelectTradeItem = (item: TradeItem) => {
    if (selectedTradeItem?.id === item.id) {
      setSelectedTradeItem(null);
    } else {
      setSelectedTradeItem(item);
    }
  };

  const handleProceedWithTradeItem = () => {
    if (selectedTradeItem) {
      // Pre-fill the listing form with the selected trade item data
      setlistData(prev => ({
        ...prev,
        Title: selectedTradeItem.name,
        Description: selectedTradeItem.description,
        Category: selectedTradeItem.category,
        Condition: selectedTradeItem.condition,
        SellingType: "Trade",
        Price: selectedTradeItem.estimatedValue.toString(),
        TradeValue: selectedTradeItem.estimatedValue.toString(),
        TradeLookingFor: selectedTradeItem.lookingFor
      }));
      
      // Hide search results and show listing form
      setShowTradeItems(false);
      setShowExistingItems(false);
      setShowInitialSearch(false);
      setShowFullListingForm(true);
      setIsMatched(false);
    }
  };

  const handelDataChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "Quantity" && typeof value === "string") {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        setlistData({ ...listData, [name]: numValue });
        return;
      }
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setlistData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setlistData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        
        // Auto-calculate auction end date and time when relevant fields change
        if (name === 'auctionLength' || name === 'auctionStartDate' || name === 'auctionStartTime' || name === 'auctionStartOption') {
          const updatedData = calculateAuctionEndDateTime(newData);
          return updatedData;
        }
        
        return newData;
      });
    }
  };

  // Function to calculate auction end date and time
  const calculateAuctionEndDateTime = (data: ListDataState): ListDataState => {
    const { auctionStartOption, auctionStartDate, auctionStartTime, auctionLength } = data;
    
    let startDateTime: Date;
    
    if (auctionStartOption === "now") {
      // Use current date and time
      startDateTime = new Date();
    } else if (auctionStartOption === "scheduled" && auctionStartDate && auctionStartTime) {
      // Use scheduled date and time
      startDateTime = new Date(`${auctionStartDate}T${auctionStartTime}`);
    } else {
      // No valid start time, return data unchanged
      return data;
    }
    
    // Add the auction length in days
    const endDateTime = new Date(startDateTime.getTime() + (parseInt(auctionLength) * 24 * 60 * 60 * 1000));
    
    // Format end date and time for inputs
    const endDate = endDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
    const endTime = endDateTime.toTimeString().slice(0, 5); // HH:MM
    
    return {
      ...data,
      auctionEndDate: endDate,
      auctionEndTime: endTime
    };
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
    // Show preview and hide the listing form
    setShowPreview(true);
    setShowFullListingForm(false);
  };

  const handleConfirmPublish = async () => {
    // Reset states
    setPublishError(null);
    setPublishSuccess(false);
    setIsPublishing(true);

    try {
      // Map selling type to CategoryId as required by API
      const getCategoryId = (sellingType: string): number => {
        switch (sellingType.toLowerCase()) {
          case 'buynow':
          case 'buy now':
            return 1;
          case 'auction':
            return 2;
          case 'trade':
            return 3;
          default:
            return 1; // Default to buy now
        }
      };

      // Generate a random VendorId (you can replace this with actual user ID)
      const generateVendorId = (): string => {
        return `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      };

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
        VendorId: generateVendorId(), // Required field
        CategoryId: getCategoryId(listData.sellType), // Required field: 1=BuyNow, 2=Auction, 3=Trade
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

      // Integrate with the API
      const response = await PublishItems(fd);
      
      // Handle successful response
      // Check if response exists and has successful status
      if (response && response.status >= 200 && response.status < 300) {
        setPublishSuccess(true);
        setShowPreview(false);
        
        // Reset form or redirect as needed
        setTimeout(() => {
          // You can add navigation logic here if needed
          setPublishSuccess(false);
        }, 3000);
      } else {
        // Handle error response
        const errorMessage = response?.data?.message || 
                           response?.statusText || 
                           'Failed to publish listing';
        throw new Error(errorMessage);
      }
      
    } catch (error: any) {
      console.error('Error publishing listing:', error);
      
      // Handle different types of errors
      let errorMessage = 'An unexpected error occurred while publishing your listing';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network error: Unable to connect to the server';
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }
      
      setPublishError(errorMessage);
    } finally {
      setIsPublishing(false);
    }
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
      <div className="sell-page">
        <header className="sell-page-header">
          <h1 className="sell-page-title">Buy. Sell. Trade</h1>
        </header>

        {showInitialSearch ? (
          <div className="initial-search-section fade-in">
            <h1 className="search-title">What would you like to sell or trade?</h1>
            <p className="search-subtitle">
              Enter the name or description of your item to get started
            </p>
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setlistData(prev => ({ ...prev, Title: e.target.value }));
                  }}
                  placeholder="e.g., iPhone 14, MacBook Pro, Nike shoes..."
                  className="main-search-input"
                  required
                />
                <button type="submit" className="search-btn">
                  Search Items
                </button>
              </div>
            </form>
            
            {/* Existing Items Display */}
            {showExistingItems && (
              <div className="existing-items-container">
                <div className="existing-items-header">
                  <h2>Found similar items</h2>
                  <p>You can trade with existing listings or create your own listing below.</p>
                </div>
                
                {/* Trade Items */}
                {groupedItems.Trade && groupedItems.Trade.length > 0 && (
                  <div className="item-group">
                    <h3 className="group-title">
                      <span className="trade-icon">🔄</span>
                      Trade Items ({groupedItems.Trade.length})
                    </h3>
                    <div className="existing-items-grid-small">
                      {groupedItems.Trade.map((item) => (
                        <div 
                          key={item.id}
                          className={`item-card-wrapper ${selectedExistingItem?.id === item.id ? 'selected' : ''}`}
                          onClick={() => handleSelectExistingItem(item)}
                        >
                          <ItemCard 
                            prodData={{
                              ...item,
                              onAdd: () => handleSelectExistingItem(item)
                            }}
                          />
                          {item.tradeValue && (
                            <div className="trade-info-overlay">
                              <small>Trade Value: GH₵{item.tradeValue}</small>
                              <small>Looking for: {item.tradeLookingFor}</small>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Continue Button for Trade Items */}
                {selectedExistingItem && groupedItems.Trade?.find(item => item.id === selectedExistingItem.id) && (
                  <div className="continue-section">
                    <div className="selected-item-info">
                      <p>Selected: <strong>{selectedExistingItem.productName}</strong></p>
                      <p>Action: Trade</p>
                    </div>
                    <button 
                      className="continue-button"
                      onClick={handleContinueWithSelected}
                    >
                      Continue with Selected Item
                    </button>
                  </div>
                )}
                
                {/* Simple Matching Items Display for non-trade items */}
                {(groupedItems.BuyNow?.length > 0 || groupedItems.Auction?.length > 0) && (
                  <div className="item-group">
                    <h3 className="group-title">
                      <span>�</span>
                      Found similar items
                    </h3>
                    <div className="matching-items-list">
                      {[...(groupedItems.BuyNow || []), ...(groupedItems.Auction || [])].map((item) => (
                        <div 
                          key={item.id} 
                          className={`matching-item-row ${selectedExistingItem?.id === item.id ? 'selected' : ''}`}
                          onClick={() => handleSelectExistingItem(item)}
                        >
                          <div className="matching-item-image">
                            <img 
                              src={item.imageFileUrl || (item.productImages && item.productImages[0]?.imageUrl)} 
                              alt={item.productName} 
                            />
                          </div>
                          <div className="matching-item-details">
                            <h4 className="matching-item-title">{item.productName}</h4>
                            <div className="matching-item-specs">
                              <span className="spec-item">Condition: {item.condition}</span>
                              <span className="spec-item">Category: {item.category}</span>
                              <span className="spec-item">Price: GH₵{item.price}</span>
                            </div>
                            <div className="matching-item-meta">
                              <span className="seller-info">by {item.seller}</span>
                              <span className="location-info">{item.location}</span>
                            </div>
                          </div>
                          {selectedExistingItem?.id === item.id && (
                            <div className="selection-checkmark">
                              <span>✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Continue Button for Selected Similar Item */}
                    {selectedExistingItem && !groupedItems.Trade?.find(item => item.id === selectedExistingItem.id) && (
                      <div className="continue-section">
                        <div className="selected-item-info">
                          <p>Selected: <strong>{selectedExistingItem.productName}</strong></p>
                          <p>Action: {selectedExistingItem.sellingType === "Auction" ? "Place Bid" : "Purchase"}</p>
                        </div>
                        <button 
                          className="continue-button"
                          onClick={handleContinueWithSelected}
                        >
                          Continue with Selected Item
                        </button>
                      </div>
                    )}
                    <div className="continue-without-match">
                      <button 
                        className="continue-without-btn"
                        onClick={handleCreateNewListing}
                      >
                        Continue without match
                      </button>
                    </div>
                  </div>
                )}

                <div className="create-new-section">
                  <div className="create-new-divider">
                    <span>OR</span>
                  </div>
                  <button 
                    className="create-new-btn"
                    onClick={handleCreateNewListing}
                  >
                    Create New Listing for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}

            {/* Trade Items Display */}
            {showTradeItems && (
              <div className="existing-items-container">
                <div className="existing-items-header">
                  <h2>Available Trade Items</h2>
                  <p>Select an item you'd like to list for trade. Your listing will be pre-filled with the item's details.</p>
                </div>
                
                <div className="trade-items-grid">
                  {tradeItems.map((item) => (
                    <TradeItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedTradeItem?.id === item.id}
                      onSelect={handleSelectTradeItem}
                    />
                  ))}
                </div>

                {/* Continue Button for Trade Items */}
                {selectedTradeItem && (
                  <div className="continue-section">
                    <div className="selected-item-info">
                      <p>Selected: <strong>{selectedTradeItem.name}</strong></p>
                      <p>This will create a trade listing with pre-filled details</p>
                    </div>
                    <button 
                      className="continue-button"
                      onClick={handleProceedWithTradeItem}
                    >
                      Create Trade Listing
                    </button>
                  </div>
                )}

                <div className="create-new-section">
                  <div className="create-new-divider">
                    <span>OR</span>
                  </div>
                  <button 
                    className="create-new-btn"
                    onClick={handleCreateNewListing}
                  >
                    Create Original Listing for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
            
            <div className="search-action-section">
              {isMatched === false && (
                <span className="match-status error">
                  No match found
                </span>
              )}
              {isMatched === true && (
                <span className="match-status success">
                  Match found!
                </span>
              )}
              {!showExistingItems && searchQuery && (
                <button
                  className="btn-modern btn-primary"
                  onClick={handleCreateNewListing}
                >
                  Create New Listing
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <nav className="page-navigation">
              <button
                className="btn-modern btn-secondary"
                onClick={handleBackClick}
              >
                ← Back
              </button>
            </nav>

            {showFullListingForm && (
              <div className="form-container">
                {/* CATEGORY & SUBCATEGORY CARD SELECTION */}
                <section className="form-section slide-up">
                  <h2 className="form-section-title">Select a Category</h2>
                  <div className="category-grid">
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
                            className={`category-card ${
                              category === option.value ? 'selected' : ''
                            }`}
                          >
                            {option.imageUrl && (
                              <img
                                src={option.imageUrl}
                                alt={option.label}
                                className="category-image"
                              />
                            )}
                            <span className="category-label">{option.label}</span>
                          </div>
                        )
                      )}
                  </div>
                  {category && selectedCategory && (
                    <div className="slide-up" style={{ marginTop: '32px' }}>
                      <h3 className="form-section-title">
                        Select a Subcategory ({selectedCategory.label})
                      </h3>
                      <div className="category-grid">
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
                              className={`category-card ${
                                subcategory === sub.value ? 'selected' : ''
                              }`}
                            >
                              {sub.imageUrl && (
                                <img
                                  src={sub.imageUrl}
                                  alt={sub.label}
                                  className="category-image"
                                />
                              )}
                              <span className="category-label">{sub.label}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* LISTING DETAILS SECTION */}
                <section className="form-section slide-up">
                  <h2 className="form-section-title">Listing Details</h2>
                  <div className="form-field-group">
                    <label className="field-label">Title</label>
                    <input
                      type="text"
                      value={listData.Title}
                      name="Title"
                      placeholder="Enter name of item"
                      onChange={handelDataChange}
                      className="field-input"
                    />
                  </div>

                  <div className="form-fields-row">
                    <div className="form-field-group">
                      <label className="field-label">Condition</label>
                      <select
                        name="Condition"
                        value={listData.Condition}
                        onChange={handelDataChange}
                        className="field-input"
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
                    
                    <div className="form-field-group">
                      <label className="field-label">Listing Type</label>
                      <div className="radio-group">
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="sellType"
                            value="Buy now"
                            checked={listData.sellType === "Buy now"}
                            onChange={handelDataChange}
                          />
                          <span>Buy now</span>
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="sellType"
                            value="Auction"
                            checked={listData.sellType === "Auction"}
                            onChange={handelDataChange}
                          />
                          <span>Auction</span>
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="sellType"
                            value="Trade"
                            checked={listData.sellType === "Trade"}
                            onChange={handelDataChange}
                          />
                          <span>Trade</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="form-field-group">
                      <label className="field-label">Quantity</label>
                      <input
                        type="number"
                        name="Quantity"
                        value={listData.Quantity}
                        onChange={handelDataChange}
                        min="1"
                        className="field-input quantity-input"
                      />
                    </div>
                  </div>
                </section>

                {/* --- SPECIFICATIONS SECTION (NOW WITH MODAL TRIGGER) --- */}
                <section className="form-section slide-up">
                  <h2 className="form-section-title">Specifications</h2>
                  <div className="specs-summary">
                    {/* Display a summary of active specifications */}
                    {category &&
                    subcategory &&
                    Object.keys(specifications).length > 0 ? (
                      <div className="current-specs">
                        <p className="specs-label">
                          <strong>Current Specifications:</strong>
                        </p>
                        <ul className="specs-list">
                          {Object.entries(specifications).map(
                            ([key, value]) => (
                              <li key={key} className="spec-item">
                                <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : String(value)}
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
                <section className="form-section slide-up">
                  <h2 className="form-section-title">Description</h2>
                  <div className="form-field-group">
                    <label className="field-label">Item Description</label>
                    <textarea
                      name="Description"
                      value={listData.Description}
                      placeholder="Please enter a good description of your item, to help it sell better"
                      onChange={handelDataChange}
                      className="field-input field-textarea"
                      rows={6}
                    />
                    <small className="field-hint">
                      Include key features, condition details, and any important information buyers should know.
                    </small>
                  </div>
                </section>

                {/* DYNAMIC PRICING SECTION BASED ON SELLING TYPE */}
                <section className="form-section slide-up">
                  <h2 className="form-section-title">
                    {listData.sellType === "Buy now" && "Pricing"}
                    {listData.sellType === "Auction" && "Auction Settings"}
                    {listData.sellType === "Trade" && "Trade Setup"}
                    {!listData.sellType && "Pricing"}
                  </h2>
                  
                  {/* BUY NOW PRICING */}
                  {(listData.sellType === "Buy now" || !listData.sellType) && (
                    <div className="pricing-content">
                      <div className="pricing-main">
                        <div className="form-field-group">
                          <label className="field-label">Set Your Price</label>
                          <div className="price-input-container">
                            <span className="currency-symbol">GH₵</span>
                            <input
                              type="number"
                              value={listData.Price}
                              name="Price"
                              onChange={handelDataChange}
                              className="field-input price-input"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <small className="field-hint">
                            Enter a competitive price to sell faster
                          </small>
                        </div>

                        <div className="form-field-group">
                          <label className="checkbox-option">
                            <input
                              type="checkbox"
                              name="acceptOffers"
                              checked={listData.acceptOffers}
                              onChange={handelDataChange}
                            />
                            <span>Accept offers from buyers</span>
                          </label>
                        </div>
                      </div>

                      <div className="smart-pricing-card">
                        <div className="smart-pricing-header">
                          <h4>Smart Pricing</h4>
                          <label className="toggle-switch">
                            <input 
                              type="checkbox" 
                              name="smartPricing"
                              checked={listData.smartPricing}
                              onChange={handelDataChange}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                        <p className="smart-pricing-description">
                          Smart Pricing automatically drops the price of your
                          listing by 10% at the best time every week until it hits
                          your floor price.
                        </p>
                        {listData.smartPricing && (
                          <div className="floor-price">
                            <label className="field-label">Floor Price</label>
                            <div className="price-input-container">
                              <span className="currency-symbol">GH₵</span>
                              <input
                                type="number"
                                name="floorPrice"
                                value={listData.floorPrice}
                                onChange={handelDataChange}
                                placeholder="999.99"
                                className="field-input price-input"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AUCTION PRICING */}
                  {listData.sellType === "Auction" && (
                    <div className="auction-content">
                      <div className="auction-timing">
                        <h4 className="subsection-title">Auction Duration</h4>
                        
                        {/* Start Time Options */}
                        <div className="form-field-group">
                          <label className="field-label">When should the auction start?</label>
                          <div className="radio-group">
                            <label className="radio-option">
                              <input
                                type="radio"
                                name="auctionStartOption"
                                value="now"
                                checked={listData.auctionStartOption === "now"}
                                onChange={handelDataChange}
                              />
                              <span>Start immediately</span>
                            </label>
                            <label className="radio-option">
                              <input
                                type="radio"
                                name="auctionStartOption"
                                value="scheduled"
                                checked={listData.auctionStartOption === "scheduled"}
                                onChange={handelDataChange}
                              />
                              <span>Schedule for later</span>
                            </label>
                          </div>
                        </div>

                        {/* Auction Length Selection */}
                        <div className="form-field-group">
                          <label className="field-label">Auction Length</label>
                          <select
                            name="auctionLength"
                            value={listData.auctionLength}
                            onChange={handelDataChange}
                            className="field-input field-select"
                          >
                            <option value="3">3 days</option>
                            <option value="5">5 days</option>
                            <option value="7">7 days (Recommended)</option>
                            <option value="10">10 days</option>
                            <option value="14">14 days</option>
                            <option value="21">21 days</option>
                            <option value="30">30 days</option>
                          </select>
                          <small className="field-hint">
                            Longer auctions typically get more bids
                          </small>
                        </div>

                        {/* Scheduled Start DateTime - Only show if scheduled option is selected */}
                        {listData.auctionStartOption === "scheduled" && (
                          <div className="datetime-grid">
                            <div className="form-field-group">
                              <label className="field-label">Start Date</label>
                              <input
                                type="date"
                                name="auctionStartDate"
                                value={listData.auctionStartDate}
                                onChange={handelDataChange}
                                className="field-input"
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            <div className="form-field-group">
                              <label className="field-label">Start Time</label>
                              <input
                                type="time"
                                name="auctionStartTime"
                                value={listData.auctionStartTime}
                                onChange={handelDataChange}
                                className="field-input"
                              />
                            </div>
                          </div>
                        )}

                        {/* Auction End Info - Auto-calculated based on start + length */}
                        <div className="auction-end-info">
                          <div className="info-card">
                            <h5>Auction will end:</h5>
                            <p className="end-datetime">
                              {listData.auctionStartOption === "now" 
                                ? `${listData.auctionLength} days from now`
                                : listData.auctionStartDate && listData.auctionStartTime
                                  ? (() => {
                                      const startDate = new Date(`${listData.auctionStartDate}T${listData.auctionStartTime}`);
                                      const endDate = new Date(startDate.getTime() + (parseInt(listData.auctionLength) * 24 * 60 * 60 * 1000));
                                      return endDate.toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      });
                                    })()
                                  : "Please set start date and time"
                              }
                            </p>
                          </div>
                        </div>

                        {/* Auto-calculated End Date and Time Display */}
                        <div className="calculated-end-section">
                          <div className="end-datetime-display">
                            {listData.auctionEndDate && listData.auctionEndTime ? (
                              <div className="auction-end-info">
                                <h4 className="auction-end-title">Auction will end</h4>
                                <div className="date-text">
                                  {(() => {
                                    const endDate = new Date(`${listData.auctionEndDate}T${listData.auctionEndTime}`);
                                    return endDate.toLocaleDateString('en-US', { 
                                      weekday: 'long',
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric'
                                    });
                                  })()}
                                </div>
                                <div className="time-text">
                                  {(() => {
                                    const endDate = new Date(`${listData.auctionEndDate}T${listData.auctionEndTime}`);
                                    return endDate.toLocaleTimeString('en-US', { 
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    });
                                  })()}
                                </div>
                                <div className="duration-text">
                                  {listData.auctionLength} day{listData.auctionLength !== "1" ? "s" : ""}
                                </div>
                              </div>
                            ) : (
                              <div className="no-date-info">
                                <h4 className="message-title">Auction end time</h4>
                                <p className="message-text">
                                  {listData.auctionStartOption === "scheduled" 
                                    ? "Set start date and time first"
                                    : "Will be calculated automatically"
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="auction-pricing">
                        <h4 className="subsection-title">Price Settings</h4>
                        <div className="pricing-grid">
                          <div className="form-field-group">
                            <label className="field-label">Starting Bid (Optional)</label>
                            <div className="price-input-container">
                              <span className="currency-symbol">GH₵</span>
                              <input
                                type="number"
                                value={listData.Price}
                                name="Price"
                                onChange={handelDataChange}
                                className="field-input price-input"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <small className="field-hint">
                              Leave empty to start at GH₵1.00
                            </small>
                          </div>

                          <div className="form-field-group">
                            <label className="field-label">Reserve Price (Optional)</label>
                            <div className="price-input-container">
                              <span className="currency-symbol">GH₵</span>
                              <input
                                type="number"
                                name="auctionReservePrice"
                                value={listData.auctionReservePrice}
                                onChange={handelDataChange}
                                className="field-input price-input"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <small className="field-hint">
                              Minimum price you'll accept
                            </small>
                          </div>

                          <div className="form-field-group">
                            <label className="field-label">Buy It Now Price (Optional)</label>
                            <div className="price-input-container">
                              <span className="currency-symbol">GH₵</span>
                              <input
                                type="number"
                                name="auctionBuyNowPrice"
                                value={listData.auctionBuyNowPrice}
                                onChange={handelDataChange}
                                className="field-input price-input"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <small className="field-hint">
                              Allow buyers to purchase immediately
                            </small>
                          </div>
                        </div>

                        <div className="form-field-group">
                          <label className="checkbox-option">
                            <input
                              type="checkbox"
                              name="acceptOffers"
                              checked={listData.acceptOffers}
                              onChange={handelDataChange}
                            />
                            <span>Accept private offers during auction</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TRADE SETUP */}
                  {listData.sellType === "Trade" && (
                    <div className="trade-content">
                      <div className="form-field-group">
                        <label className="field-label">Estimated Value</label>
                        <div className="price-input-container">
                          <span className="currency-symbol">GH₵</span>
                          <input
                            type="number"
                            name="tradeValue"
                            value={listData.tradeValue}
                            onChange={handelDataChange}
                            className="field-input price-input"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <small className="field-hint">
                          Approximate value of your item for trade reference
                        </small>
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">What are you looking for?</label>
                        <textarea
                          name="tradeDescription"
                          value={listData.tradeDescription}
                          onChange={handelDataChange}
                          className="field-input field-textarea"
                          placeholder="Describe what you'd like to trade for..."
                          rows={4}
                        />
                      </div>

                      <div className="trade-preferences">
                        <label className="field-label">Trade Preferences</label>
                        <div className="checkbox-grid">
                          {["Electronics", "Fashion", "Home & Garden", "Automotive", "Sports", "Books", "Collectibles", "Other"].map((pref) => (
                            <label key={pref} className="checkbox-option">
                              <input
                                type="checkbox"
                                value={pref}
                                checked={listData.tradePreferences.includes(pref)}
                                onChange={(e) => {
                                  const { value, checked } = e.target;
                                  setlistData(prev => ({
                                    ...prev,
                                    tradePreferences: checked 
                                      ? [...prev.tradePreferences, value]
                                      : prev.tradePreferences.filter(p => p !== value)
                                  }));
                                }}
                              />
                              <span>{pref}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-field-group">
                        <label className="checkbox-option">
                          <input
                            type="checkbox"
                            name="acceptCash"
                            checked={listData.acceptCash}
                            onChange={handelDataChange}
                          />
                          <span>Accept cash + trade combinations</span>
                        </label>
                      </div>
                    </div>
                  )}
                </section>
                
                {/* SHIPPING SECTION */}
                <section className="form-section slide-up">
                  <h2 className="form-section-title">Shipping Details</h2>
                  <div className="shipping-grid">
                    {Object.entries(typedTemplate.product.shipping.fields).map(
                      ([key, field]) => {
                        const fieldId = `shipping-${field.label
                          .replace(/\s/g, "_")
                          .toLowerCase()}`;

                        switch (field.type) {
                          case "text":
                            return (
                              <div key={key} className="form-field-group">
                                <label className="field-label" htmlFor={fieldId}>
                                  {field.label}
                                  {field.unit_hint ? ` (${field.unit_hint})` : ""}
                                  {field.required && <span className="required">*</span>}
                                </label>
                                <input
                                  id={fieldId}
                                  name={field.label}
                                  type="text"
                                  value={
                                    (listData as any)[field.label] ||
                                    field.default ||
                                    ""
                                  }
                                  placeholder={field.placeholder}
                                  required={field.required}
                                  className="field-input"
                                  onChange={handelDataChange}
                                />
                              </div>
                            );
                          case "number":
                            const numField = field as NumberField;
                            return (
                              <div key={key} className="form-field-group">
                                <label className="field-label" htmlFor={fieldId}>
                                  {field.label}
                                  {numField.unit ? ` (${numField.unit})` : ""}
                                  {field.required && <span className="required">*</span>}
                                </label>
                                <input
                                  id={fieldId}
                                  name={field.label}
                                  type="number"
                                  value={
                                    (listData as any)[field.label] ||
                                    numField.default ||
                                    ""
                                  }
                                  placeholder={field.placeholder}
                                  required={field.required}
                                  className="field-input"
                                  onChange={handelDataChange}
                                  min={numField.min}
                                  max={numField.max}
                                  step={numField.step}
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
                              <div key={key} className="form-field-group">
                                <label className="field-label" htmlFor={fieldId}>
                                  {field.label}
                                  {field.required && <span className="required">*</span>}
                                </label>
                                <select
                                  id={fieldId}
                                  name={field.label}
                                  value={tempSpecifications[field.label] || ""}
                                  onChange={(e) => handelDataChange(e)}
                                  required={field.required}
                                  className="field-input"
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
                              <div key={key} className="form-field-group">
                                <label className="checkbox-option">
                                  <input
                                    id={fieldId}
                                    name={field.label}
                                    type="checkbox"
                                    defaultChecked={boolField.default as boolean}
                                    onChange={handelDataChange}
                                  />
                                  <span>{field.label}</span>
                                </label>
                              </div>
                            );
                          default:
                            return null;
                        }
                      }
                    )}
                  </div>
                </section>

                {/* PHOTOS SECTION */}
                <section className="form-section slide-up">
                  <h2 className="form-section-title">Photos</h2>
                  <div className="photo-upload-container">
                    <div className="photo-grid">
                      <div className="main-photo-slot">
                        {defaultImg ? (
                          <div className="photo-preview main">
                            <img src={defaultImg} alt="main" className="preview-image" />
                            <button 
                              className="photo-remove-btn"
                              onClick={() => setdefaultImg("")}
                              type="button"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="photo-placeholder main">
                            <IoAddCircle className="add-icon" />
                            <span>Main Photo</span>
                          </div>
                        )}
                      </div>
                      
                      {listData.prevImg.map((src, index) => {
                        if (src === defaultImg) return null;
                        return (
                          <div key={index} className="photo-preview">
                            <img src={src} alt={`preview ${index}`} className="preview-image" />
                            <button 
                              className="photo-remove-btn"
                              onClick={() => {
                                const newPrevImg = listData.prevImg.filter((_, i) => i !== index);
                                setlistData(prev => ({ ...prev, prevImg: newPrevImg }));
                              }}
                              type="button"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                      
                      {/* Additional photo slots */}
                      {Array.from({ length: Math.max(0, 5 - listData.prevImg.length) }).map((_, index) => (
                        <div key={`empty-${index}`} className="photo-placeholder">
                          <input
                            type="file"
                            accept="image/*"
                            name="addIMG"
                            className="photo-input"
                            onChange={setImg}
                          />
                          <IoAddCircle className="add-icon" />
                          <span>Add Photo</span>
                        </div>
                      ))}
                    </div>
                    <div className="photo-upload-info">
                      <p className="upload-hint">
                        <strong>Tips for great photos:</strong>
                      </p>
                      <ul className="upload-tips">
                        <li>Use natural lighting</li>
                        <li>Show all angles of your item</li>
                        <li>Include any defects or wear</li>
                        <li>First photo will be your main listing image</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* PUBLISH SECTION */}
                <section className="publish-section">
                  <button 
                    type="button" 
                    onClick={handlePublish}
                    className="btn-modern btn-primary publish-btn"
                  >
                    Publish Listing
                  </button>
                </section>
              </div>
            )}
          </div>
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

        {/* --- LISTING PREVIEW SECTION --- */}
        {showPreview && (
          <div className="preview-section">
            <div className="preview-header">
              <h2>Preview Your Listing</h2>
              <button 
                className="back-btn"
                onClick={() => {
                  setShowPreview(false);
                  setShowFullListingForm(true);
                }}
              >
                ← Back to Edit
              </button>
            </div>
            
            <div className="preview-content">
              <div className="preview-listing">
                {/* Listing Image */}
                <div className="preview-image-section">
                  {defaultImg ? (
                    <img 
                      src={defaultImg} 
                      alt={listData.Title}
                      className="preview-image"
                    />
                  ) : (
                    <div className="preview-no-image">
                      <span>No image uploaded</span>
                    </div>
                  )}
                </div>

                {/* Listing Details */}
                <div className="preview-details">
                  <div className="preview-header">
                    <h3 className="preview-title">{listData.Title || "No title"}</h3>
                    <div className="preview-price">
                      {listData.sellType === "Buy now" && (
                        <span className="price-tag">GH₵{listData.Price || "0.00"}</span>
                      )}
                      {listData.sellType === "Auction" && (
                        <div className="auction-info">
                          <span className="auction-badge">AUCTION</span>
                          {listData.Price && (
                            <span className="starting-bid">Starting: GH₵{listData.Price}</span>
                          )}
                        </div>
                      )}
                      {listData.sellType === "Trade" && (
                        <div className="trade-info">
                          <span className="trade-badge">TRADE</span>
                          {listData.tradeValue && (
                            <span className="trade-value">Value: GH₵{listData.tradeValue}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="preview-meta">
                    <span className="preview-condition">Condition: {listData.Condition || "Not specified"}</span>
                    <span className="preview-category">Category: {category || "Not selected"}</span>
                    <span className="preview-quantity">Quantity: {listData.Quantity}</span>
                  </div>

                  {listData.Summary && (
                    <div className="preview-summary">
                      <h4>Summary</h4>
                      <p>{listData.Summary}</p>
                    </div>
                  )}

                  {listData.Description && (
                    <div className="preview-description">
                      <h4>Description</h4>
                      <p>{listData.Description}</p>
                    </div>
                  )}

                  {/* Auction specific details */}
                  {listData.sellType === "Auction" && listData.auctionEndDate && (
                    <div className="preview-auction-details">
                      <h4>Auction Details</h4>
                      <div className="auction-end-info">
                        <span className="auction-end-title">AUCTION WILL END</span>
                        <div className="date-text">
                          {(() => {
                            const endDate = new Date(`${listData.auctionEndDate}T${listData.auctionEndTime}`);
                            return endDate.toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            });
                          })()}
                        </div>
                        <div className="time-text">
                          {(() => {
                            const endDate = new Date(`${listData.auctionEndDate}T${listData.auctionEndTime}`);
                            return endDate.toLocaleTimeString('en-US', { 
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            });
                          })()}
                        </div>
                        <div className="duration-text">
                          {listData.auctionLength} day{listData.auctionLength !== "1" ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trade specific details */}
                  {listData.sellType === "Trade" && (
                    <div className="preview-trade-details">
                      <h4>Trade Details</h4>
                      {listData.tradeDescription && (
                        <p><strong>Looking for:</strong> {listData.tradeDescription}</p>
                      )}
                      {listData.tradeValue && (
                        <p><strong>Estimated Value:</strong> GH₵{listData.tradeValue}</p>
                      )}
                      {listData.acceptCash && (
                        <p className="cash-accepted">✓ Cash + trade combinations accepted</p>
                      )}
                    </div>
                  )}

                  {/* Specifications */}
                  {Object.keys(specifications).length > 0 && (
                    <div className="preview-specifications">
                      <h4>Specifications</h4>
                      <div className="spec-grid">
                        {Object.entries(specifications).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-label">{key}:</span>
                            <span className="spec-value">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="preview-actions">
              {/* Error notification */}
              {publishError && (
                <div className="publish-notification error">
                  <span className="error-icon">⚠️</span>
                  <span>{publishError}</span>
                  <button 
                    className="close-btn"
                    onClick={() => setPublishError(null)}
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Success notification */}
              {publishSuccess && (
                <div className="publish-notification success">
                  <span className="success-icon">✅</span>
                  <span>Listing published successfully!</span>
                </div>
              )}

              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowPreview(false);
                  setShowFullListingForm(true);
                }}
                disabled={isPublishing}
              >
                Edit Listing
              </button>
              <button 
                className={`btn-primary ${isPublishing ? 'loading' : ''}`}
                onClick={handleConfirmPublish}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <span className="loading-spinner"></span>
                    Publishing...
                  </>
                ) : (
                  'Confirm & Publish'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellListing;
