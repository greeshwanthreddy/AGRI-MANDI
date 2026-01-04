"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Droplet, Sun, Sprout, Calendar, CheckCircle2 } from "lucide-react"
import type { CropData } from "@/lib/crop-data"

interface CropDetailsModalProps {
  crop: CropData | null
  open: boolean
  onClose: () => void
}

export function CropDetailsModal({ crop, open, onClose }: CropDetailsModalProps) {
  if (!crop) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {crop.name} ({crop.telugu})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Crop Image */}
          <div className="relative h-64 w-full overflow-hidden rounded-lg">
            <img src={crop.image || "/placeholder.svg"} alt={crop.name} className="h-full w-full object-cover" />
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{crop.description}</p>

          {/* Growing Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Calendar className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Season</h3>
                <p className="text-sm text-muted-foreground">{crop.season}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Sprout className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Growth Period</h3>
                <p className="text-sm text-muted-foreground">{crop.growthPeriod}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Droplet className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Water Requirement</h3>
                <p className="text-sm text-muted-foreground">{crop.waterRequirement}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Sun className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Temperature</h3>
                <p className="text-sm text-muted-foreground">{crop.temperature}</p>
              </div>
            </div>
          </div>

          {/* Soil Type */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Soil Type</h3>
            <Badge variant="secondary">{crop.soilType}</Badge>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="mb-3 font-semibold">Benefits</h3>
            <ul className="space-y-2">
              {crop.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
