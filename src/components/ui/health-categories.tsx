import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Baby, 
  Shield, 
  Stethoscope, 
  Thermometer, 
  Calendar,
  Users,
  AlertTriangle
} from "lucide-react";

const healthCategories = [
  {
    id: "symptoms",
    title: "Symptom Checker",
    description: "Check symptoms and get guidance",
    icon: Thermometer,
    color: "bg-gradient-warm",
    query: "I have some symptoms I'd like to check"
  },
  {
    id: "vaccination",
    title: "Vaccination Schedule",
    description: "Child & adult vaccination info",
    icon: Shield,
    color: "bg-gradient-secondary",
    query: "I need vaccination schedule information"
  },
  {
    id: "maternal",
    title: "Maternal Health",
    description: "Pregnancy & newborn care",
    icon: Baby,
    color: "bg-gradient-primary",
    query: "I need maternal health guidance"
  },
  {
    id: "chronic",
    title: "Chronic Diseases",
    description: "Diabetes, BP, heart conditions",
    icon: Heart,
    color: "bg-gradient-warm",
    query: "I need information about chronic diseases"
  },
  {
    id: "preventive",
    title: "Preventive Care",
    description: "Health tips & prevention",
    icon: Stethoscope,
    color: "bg-gradient-secondary",
    query: "I want preventive healthcare tips"
  },
  {
    id: "emergency",
    title: "Emergency Care",
    description: "First aid & urgent symptoms",
    icon: AlertTriangle,
    color: "bg-gradient-warm",
    query: "I need emergency health guidance"
  },
  {
    id: "elderly",
    title: "Elderly Care",
    description: "Senior health guidance",
    icon: Users,
    color: "bg-gradient-primary",
    query: "I need elderly care information"
  },
  {
    id: "schedule",
    title: "Health Calendar",
    description: "Track appointments & schedules",
    icon: Calendar,
    color: "bg-gradient-secondary",
    query: "I want to manage my health calendar"
  },
];

interface HealthCategoriesProps {
  onCategorySelect: (query: string, categoryId?: string) => void;
  className?: string;
}

export function HealthCategories({ onCategorySelect, className }: HealthCategoriesProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          How can I help you today?
        </h2>
        <p className="text-muted-foreground">
          Choose a category to get started with health information
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {healthCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id}
              className="health-card group"
              onClick={() => onCategorySelect(category.query, category.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-4 rounded-xl text-white shadow-medium group-hover:scale-110 transition-bounce float-animation",
                    category.color
                  )}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-6 p-6 bg-gradient-warm/10 border border-accent/20 rounded-xl shadow-soft">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-warm rounded-lg shadow-medium">
            <Stethoscope className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Quick Tip</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This information is for educational purposes. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}