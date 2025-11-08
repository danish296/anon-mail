"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function BetaNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has previously dismissed the notification
    const dismissed = localStorage.getItem('beta-notification-dismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    // Remember dismissal for this session
    localStorage.setItem('beta-notification-dismissed', 'true')
  }

  if (isDismissed || !isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-lg border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 backdrop-blur-sm shadow-lg">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 animate-pulse"></div>
            
            <div className="relative p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                    <Gift className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                      🎉 Free Beta Access
                    </h3>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-200/50 dark:bg-amber-800/50">
                      <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        All Features Free
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                    You're currently using our <strong>free beta version</strong> with access to all premium features! 
                    Enjoy unlimited emails, AI assistance, and file attachments at no cost.
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                    <span className="font-medium">Coming Soon:</span>
                    <span>Pricing plans will be introduced in the coming months</span>
                  </div>
                </div>

                {/* Dismiss button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-shrink-0 h-6 w-6 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100 dark:text-amber-400 dark:hover:text-amber-200 dark:hover:bg-amber-900/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
