"use client";

import type { KeyboardEvent } from "react";
import type { BriefingOption } from "@/data/briefing";

type BriefingOptionListProps<T extends string> = {
  legend: string;
  options: BriefingOption<T>[];
  value: T | "";
  onChange: (value: T) => void;
  multiple?: false;
};

type MultipleBriefingOptionListProps = {
  legend: string;
  options: BriefingOption[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple: true;
};

export default function BriefingOptionList<T extends string>(props: BriefingOptionListProps<T> | MultipleBriefingOptionListProps) {
  const toggle = (optionValue: string) => {
    if (props.multiple) {
      props.onChange(props.value.includes(optionValue) ? props.value.filter((item) => item !== optionValue) : [...props.value, optionValue]);
      return;
    }
    props.onChange(optionValue as T);
  };

  const activateWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, optionValue: string) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle(optionValue);
  };

  return (
    <fieldset className="briefing-options">
      <legend className="sr-only">{props.legend}</legend>
      {props.options.map((option, index) => {
        const selected = props.multiple ? props.value.includes(option.value) : props.value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`briefing-option${selected ? " is-selected" : ""}`}
            aria-pressed={selected}
            onClick={() => toggle(option.value)}
            onKeyDown={(event) => activateWithKeyboard(event, option.value)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{option.label}</strong>
            <i aria-hidden="true">{selected ? "Selecionado" : "+"}</i>
          </button>
        );
      })}
    </fieldset>
  );
}
