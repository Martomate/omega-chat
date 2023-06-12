"use client";

import { HelloResponse } from "@/app/api/hello/route";
import { useEffect, useState } from "react";

const fetchHello = async () => {
  const response = await fetch("/api/hello", {
    method: "POST",
    body: JSON.stringify({ name: "World" }),
  });
  const { text }: HelloResponse = await response.json();
  return text;
};

export default function Hello() {
  const [text, setText] = useState<string | undefined>();
  useEffect(() => {
    fetchHello().then((text) => setText(text));
  }, []);

  return text ? text : "Waiting...";
}
