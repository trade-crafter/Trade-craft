"use client"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { PositionRule, ConditionGroup, IndicatorCondition } from "./strategy-builder"
import IndicatorLogicEngine from "./indicator-logic-engine"

interface EntryExitNodeProps {
  positionRule: PositionRule
  onChange: (updatedRule: PositionRule) => void
}

export default function EntryExitNode({ positionRule, onChange }: EntryExitNodeProps) {
  const addConditionGroup = () => {
    const newGroup: ConditionGroup = {
      id: "group-" + Date.now(),
      conditions: [
        {
          id: "condition-" + Date.now(),
          indicator: "rsi",
          parameter: "value",
          logic: "less_than",
          value: "30",
          timeframe: "1d",
          params: {
            period: 14,
            source: "close",

           // overbought: 70,
            //oversold: 30,

          },
        },
      ],
      operator: "and",
    }

    onChange({
      ...positionRule,
      conditionGroups: [...positionRule.conditionGroups, newGroup],
    })
  }

  const removeConditionGroup = (groupId: string) => {
    onChange({
      ...positionRule,
      conditionGroups: positionRule.conditionGroups.filter((group) => group.id !== groupId),
    })
  }

  const updateConditionGroup = (groupId: string, updatedGroup: Partial<ConditionGroup>) => {
    onChange({
      ...positionRule,
      conditionGroups: positionRule.conditionGroups.map((group) =>
        group.id === groupId ? { ...group, ...updatedGroup } : group,
      ),
    })
  }

  const addCondition = (groupId: string) => {
    const newCondition: IndicatorCondition = {
      id: "condition-" + Date.now(),
      indicator: "rsi",
      parameter: "value",
      logic: "less_than",
      value: "30",
      timeframe: "1d",
      params: {
        period: 14,
        source: "close",

     //   overbought: 70,
       // oversold: 30,

      },
    }

    onChange({
      ...positionRule,
      conditionGroups: positionRule.conditionGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: [...group.conditions, newCondition],
            }
          : group,
      ),
    })
  }

  const removeCondition = (groupId: string, conditionId: string) => {
    onChange({
      ...positionRule,
      conditionGroups: positionRule.conditionGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.filter((condition) => condition.id !== conditionId),
            }
          : group,
      ),
    })
  }

  const updateCondition = (groupId: string, conditionId: string, updatedCondition: Partial<IndicatorCondition>) => {
    onChange({
      ...positionRule,
      conditionGroups: positionRule.conditionGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((condition) =>
                condition.id === conditionId ? { ...condition, ...updatedCondition } : condition,
              ),
            }
          : group,
      ),
    })
  }

  return (
    <div className="space-y-4">
      {positionRule.conditionGroups.map((group, groupIndex) => (
        <div key={group.id} className="space-y-4">
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">When</h4>
                  {positionRule.conditionGroups.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeConditionGroup(group.id)}
                      className="h-8 px-2 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {group.conditions.map((condition, conditionIndex) => (
                  <div key={condition.id} className="space-y-4">
                    <IndicatorLogicEngine
                      condition={condition}
                      onChange={(updatedCondition) => updateCondition(group.id, condition.id, updatedCondition)}
                      onRemove={() => removeCondition(group.id, condition.id)}
                    />

                    {/* Only show the timeframe and add button for the last condition in the group */}
                    {conditionIndex === group.conditions.length - 1 && (
                      <div className="flex justify-between items-center">
                        <div className="space-y-4">
                          <h4 className="font-medium">Timeframe</h4>
                          <Select
                            value={condition.timeframe}
                            onValueChange={(value: string) =>
                              updateCondition(group.id, condition.id, { timeframe: value })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1m">1 Minute</SelectItem>
                              <SelectItem value="5m">5 Minutes</SelectItem>
                              <SelectItem value="15m">15 Minutes</SelectItem>
                              <SelectItem value="30m">30 Minutes</SelectItem>
                              <SelectItem value="45m">45 Minutes</SelectItem>
                              <SelectItem value="1h">1 Hour</SelectItem>
                              <SelectItem value="2h">2 Hours</SelectItem>
                              <SelectItem value="4h">4 Hours</SelectItem>
                              <SelectItem value="1d">1 Day</SelectItem>
                              <SelectItem value="1w">1 Week</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => addCondition(group.id)} className="ml-auto">
                          <Plus className="h-4 w-4 mr-2" /> Add Condition
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {groupIndex < positionRule.conditionGroups.length - 1 && (
            <div className="flex justify-center">
              <div className="bg-muted px-4 py-2 rounded-md font-medium">OR</div>
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" onClick={addConditionGroup} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Alternative Condition Group
      </Button>
    </div>
  )
}
