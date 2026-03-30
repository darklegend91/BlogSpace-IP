"use client"

import React from "react"
import { cn } from "../../lib/utils"

export const Tabs = ({ defaultValue, className, children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  return (
    <div className={cn("w-full", className)} {...props}>
      {React.Children.map(children, (child) => React.cloneElement(child, { activeTab, setActiveTab }))}
    </div>
  )
}

export const TabsList = ({ className, children, activeTab, setActiveTab, ...props }) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  >
    {React.Children.map(children, (child) => React.cloneElement(child, { activeTab, setActiveTab }))}
  </div>
)

export const TabsTrigger = ({ value, className, children, activeTab, setActiveTab, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeTab === value ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50",
      className,
    )}
    onClick={() => setActiveTab(value)}
    {...props}
  >
    {children}
  </button>
)

export const TabsContent = ({ value, className, children, activeTab, ...props }) => {
  if (activeTab !== value) return null

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}