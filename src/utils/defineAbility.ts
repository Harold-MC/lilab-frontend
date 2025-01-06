import { AbilityBuilder, PureAbility } from '@casl/ability';

type Actions = 'create' | 'read' | 'update' | 'delete';
type Subjects = 'Article' | 'Comment' | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

export const defineAbilityFor = (
  permissions: { action: Actions; subject: Subjects }[]
): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

  permissions.forEach(permission => {
    can(permission.action, permission.subject);
  });

  return build();
};
