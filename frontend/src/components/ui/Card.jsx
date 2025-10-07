import { cn } from "@/utils/helpers";

const Card = ({
  children,
  className = "",
  padding = true,
  hover = false,
  glow = false,
}) => {
  const classes = cn(
    "bg-white rounded-2xl shadow-card transition-all duration-300",
    "border border-gray-100",
    padding === true && "p-8",
    typeof padding === "string" && padding,
    hover &&
      "hover:shadow-elevated hover:border-gray-200 cursor-pointer transform hover:-translate-y-0.5",
    glow && "shadow-lg shadow-primary-500/10",
    className
  );

  return <div className={classes}>{children}</div>;
};

const CardHeader = ({ children, className = "" }) => {
  return <div className={cn("mb-6 space-y-2", className)}>{children}</div>;
};

const CardTitle = ({ children, className = "" }) => {
  return (
    <h3
      className={cn(
        "text-xl font-bold text-gray-900 tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = "" }) => {
  return (
    <p className={cn("text-gray-600 leading-relaxed", className)}>{children}</p>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={cn("space-y-4", className)}>{children}</div>;
};

const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={cn("mt-6 pt-6 border-t border-gray-200/60", className)}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
