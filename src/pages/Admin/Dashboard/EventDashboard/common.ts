import { StylesConfig } from "react-select";

interface OptionType {
    label: string;
    value: string;
}

const customReactSelectStyles: StylesConfig<OptionType> = {
    container: (provided) => ({
        ...provided,
        width: "100%",
        maxWidth: "400px",
    }),
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "#2b2b2b",
        border: state.isFocused ? "1.5px solid #1ed45e" : "1.5px solid #444",
        borderRadius: "4px",
        padding: "4px",
        color: "#fff",
        boxShadow: "none",
        transition: "border-color 0.2s ease",
        "&:hover": {
            borderColor: "#1ed45e",
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#1d1d1d",
        borderRadius: "4px",
        border: "1px solid #444",
        marginTop: "4px",
    }),
    menuList: (provided) => ({
        ...provided,
        padding: "0",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#1ed45e" : "transparent",
        color: state.isFocused ? "#252525" : "#fff",
        padding: "10px 12px",
        cursor: "pointer",
        transition: "background-color 0.2s ease, color 0.2s ease",
        "&:hover": {
            backgroundColor: "#2dcf66",
            color: "#252525",
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#fff",
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#848484",
        fontSize: "0.9rem",
    }),
    indicatorSeparator: () => ({
        display: "none",
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: "#1ed45e",
        "&:hover": {
            color: "#2dcf66",
        },
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#1ed45e",
        color: "#252525",
        borderRadius: "4px",
        padding: "4px",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: "#252525",
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: "#252525",
        "&:hover": {
            backgroundColor: "#2dcf66",
            color: "#252525",
        },
    }),
};

export default customReactSelectStyles;
